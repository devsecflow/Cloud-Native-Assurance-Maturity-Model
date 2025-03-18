# CNAMM Assessment Email Delivery with Supabase

This directory contains the Supabase configuration for sending CNAMM assessment results via email.

## Architecture

1. When a user completes the assessment and submits their email:
   - The assessment results and email request are stored in Supabase tables
   - The email HTML content is generated in the browser and stored with the request

2. A Supabase Edge Function processes email requests:
   - Triggered by a cron job that runs every 5 minutes
   - Fetches pending email requests
   - Sends emails using Resend.com (an email delivery service)
   - Updates the status of processed requests

## Setup Instructions

### 1. Run SQL setup script

```bash
supabase db push --db-url postgres://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
```

Or manually run the contents of `setup.sql` in the Supabase SQL editor.

### 2. Deploy the Edge Function

```bash
supabase functions deploy send-email
```

### 3. Set up environment variables

In the Supabase dashboard, go to Settings → API → Functions and add these environment variables:

```
RESEND_API_KEY=re_123456789
FROM_EMAIL=noreply@yourdomain.com
FUNCTION_SECRET=your-secret-token-for-cron-job
```

### 4. Set up the cron job

The cron job that triggers the function every 5 minutes is defined in `cron.json`.

Deploy it with:

```bash
supabase functions deploy-cron
```

## Testing

You can manually trigger the function to process emails:

```bash
curl -X POST \
  -H "Authorization: Bearer your-secret-token" \
  https://[YOUR_PROJECT_REF].functions.supabase.co/send-email
```

## Monitoring

To monitor email delivery:

1. Check the Supabase database:
   - Query the `email_requests` table to see the status of email requests
   - Look for records with `processed = false` or `status = 'error'`

2. Check the Supabase Function logs:
   - Go to Edge Functions → send-email → Logs
   - Look for any error messages or failures

3. Check the Resend dashboard:
   - Monitor delivery status and open rates
   - Check if any emails bounce or fail to deliver