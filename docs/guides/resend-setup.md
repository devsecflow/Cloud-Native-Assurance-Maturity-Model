# Setting Up Email Delivery with Resend

This guide explains how to set up [Resend](https://resend.com) for sending CNAMM assessment results via email.

## What is Resend?

Resend is a modern email API for developers. It provides reliable email delivery with excellent deliverability rates and a simple API. We use Resend to send beautifully formatted assessment results to users who request them.

## Setup Steps

### 1. Create a Resend Account

1. Go to [resend.com](https://resend.com) and sign up for an account
2. Verify your email address

### 2. Add Your Domain

For best deliverability, you should send emails from your own domain:

1. In the Resend dashboard, go to Domains → Add Domain
2. Follow the instructions to add your domain (requires adding DNS records)
3. Wait for domain verification (usually takes 24-48 hours)

If you don't have a domain, you can use Resend's shared domain for testing, but emails may be more likely to be marked as spam.

### 3. Get Your API Key

1. In the Resend dashboard, go to API Keys → Create API Key
2. Give your API key a name (e.g., "CNAMM Assessment")
3. Copy the API key - you'll need it for the next step

### 4. Add the API Key to Supabase

1. In the Supabase dashboard, go to Settings → API → Functions
2. Add these environment variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `FROM_EMAIL`: Your email address (e.g., `assessment@yourdomain.com`)

## Testing Email Delivery

To test that emails are being sent correctly:

1. Complete the CNAMM Quick Assessment
2. Submit your email on the results page
3. Check your inbox for the assessment results email

If the email doesn't arrive:

1. Check the Supabase database to see if the email request was recorded
   - In the Supabase dashboard, go to Table Editor → email_requests
   - Look for your email address in the records
2. Check the Resend dashboard to see if there were any delivery issues
   - In the Resend dashboard, go to Events to see email activity

## Troubleshooting

### Emails not being sent

1. Verify that the Supabase Edge Function is deployed and running
2. Check that the cron job is correctly configured
3. Ensure the Resend API key is valid and correctly set in Supabase

### Emails going to spam

1. Make sure your domain is properly verified in Resend
2. Ensure your email content doesn't contain spam triggers
3. Consider using a more specific sender name and email

### Error messages in Supabase logs

Common errors and solutions:

- "Invalid API key": Double-check your Resend API key
- "Rate limit exceeded": Your plan may limit the number of emails you can send
- "Domain not verified": Ensure your domain is verified in Resend

## Getting Help

If you encounter issues setting up email delivery:

- Resend documentation: [docs.resend.com](https://docs.resend.com)
- Supabase Edge Functions: [supabase.com/docs/guides/functions](https://supabase.com/docs/guides/functions)
- Report issues on GitHub: [github.com/devsecflow/Cloud-Native-Assurance-Maturity-Model/issues](https://github.com/devsecflow/Cloud-Native-Assurance-Maturity-Model/issues)