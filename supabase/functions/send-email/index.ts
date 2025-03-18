// This Edge Function is triggered by a cron job that runs frequently to process
// pending email requests from the email_requests table

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import * as Resend from 'https://esm.sh/resend@1.0.0'

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const resendApiKey = Deno.env.get('RESEND_API_KEY') || ''
const fromEmail = Deno.env.get('FROM_EMAIL') || 'noreply@cnamm.org'

const supabase = createClient(supabaseUrl, supabaseServiceKey)
const resend = new Resend.Resend(resendApiKey)

// Process email requests
async function processEmailRequests() {
  // Get unprocessed email requests (limit to 10 at a time to avoid timeouts)
  const { data: requests, error } = await supabase
    .from('email_requests')
    .select('*')
    .eq('processed', false)
    .order('created_at', { ascending: true })
    .limit(10)

  if (error) {
    console.error('Error fetching email requests:', error)
    return { error: 'Failed to fetch email requests' }
  }

  if (!requests || requests.length === 0) {
    return { message: 'No pending email requests found' }
  }

  const results = []

  // Process each request
  for (const request of requests) {
    try {
      // Send email using Resend
      const { data, error: sendError } = await resend.emails.send({
        from: `CNAMM Assessment <${fromEmail}>`,
        to: request.email,
        subject: 'Your CNAMM Assessment Results',
        html: request.html_content,
      })

      if (sendError) {
        throw sendError
      }

      // Update request as processed
      const { error: updateError } = await supabase
        .from('email_requests')
        .update({
          processed: true,
          processed_at: new Date().toISOString(),
          status: 'sent',
        })
        .eq('id', request.id)

      if (updateError) {
        throw updateError
      }

      results.push({
        id: request.id,
        email: request.email,
        status: 'sent',
        message_id: data?.id,
      })
    } catch (err) {
      console.error(`Error processing email request ${request.id}:`, err)

      // Update request with error
      await supabase
        .from('email_requests')
        .update({
          status: 'error',
          error_message: err.message || 'Unknown error',
        })
        .eq('id', request.id)

      results.push({
        id: request.id,
        email: request.email,
        status: 'error',
        error: err.message,
      })
    }
  }

  return { processed: results.length, results }
}

// Handle HTTP requests
serve(async (req) => {
  // Check for authorized access
  const authHeader = req.headers.get('Authorization')
  const expectedToken = Deno.env.get('FUNCTION_SECRET')

  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  try {
    const result = await processEmailRequests()
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error processing emails:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
})