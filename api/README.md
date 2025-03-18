# CNAMM Assessment Email API

This directory contains serverless functions that handle the email delivery of CNAMM assessment results.

## Setup Instructions

### Required Environment Variables

For the email delivery to work correctly, you need to set up the following environment variables in your deployment platform (e.g., Netlify, Vercel):

- `SMTP_HOST`: Your SMTP server host (e.g., smtp.gmail.com)
- `SMTP_PORT`: SMTP port (usually 587 for TLS or 465 for SSL)
- `SMTP_SECURE`: Use 'true' for port 465, 'false' for other ports
- `SMTP_USER`: Username for SMTP authentication
- `SMTP_PASSWORD`: Password for SMTP authentication
- `SMTP_FROM_EMAIL`: Email address that appears in the "From" field

### Setting up with Netlify

1. Deploy your site to Netlify
2. Go to Site settings > Environment variables
3. Add all the required environment variables listed above
4. Redeploy your site

### Testing Locally

To test the functions locally using Netlify CLI:

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Create a `.env` file in the project root with the environment variables
3. Run `netlify dev` to start the local development server
4. Test the function at `http://localhost:8888/.netlify/functions/send-results`

## Security Considerations

- Never commit your SMTP credentials to the repository
- Consider using environment-specific credentials
- For production, use a dedicated email address for sending assessment results
- Implement rate limiting to prevent abuse