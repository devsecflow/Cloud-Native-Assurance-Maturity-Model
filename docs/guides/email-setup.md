# Setting Up Email Delivery for Assessment Results

This guide explains how to set up and deploy the email delivery functionality for CNAMM assessment results.

## Overview

The CNAMM Quick Assessment tool includes a feature that allows users to receive their assessment results via email. This feature requires:

1. A serverless function deployment
2. SMTP email service configuration

## Deployment Options

### Option 1: Netlify (Recommended)

Netlify makes it easy to deploy the serverless function with your website.

1. **Create a Netlify account** at [netlify.com](https://www.netlify.com/) if you don't have one.

2. **Connect your repository** to Netlify:
   - Go to Netlify → New site from Git
   - Choose your Git provider
   - Select the CNAMM repository
   - Configure build settings (use default settings)

3. **Set up environment variables**:
   - Go to Site settings → Environment variables
   - Add the following variables:
     - `SMTP_HOST`: Your SMTP server host (e.g., smtp.gmail.com)
     - `SMTP_PORT`: SMTP port (usually 587 for TLS or 465 for SSL)
     - `SMTP_SECURE`: Use 'true' for port 465, 'false' for other ports
     - `SMTP_USER`: Username for SMTP authentication
     - `SMTP_PASSWORD`: Password for SMTP authentication
     - `SMTP_FROM_EMAIL`: Email address that appears in the "From" field

4. **Deploy**:
   - Trigger a new deployment
   - The serverless function will be automatically deployed with your site

### Option 2: Vercel

Vercel is another excellent option for serverless deployment.

1. **Create a Vercel account** at [vercel.com](https://vercel.com/) if you don't have one.

2. **Import your repository**:
   - Click "Import Project"
   - Choose "Import Git Repository"
   - Select the CNAMM repository
   - Configure project settings (use default settings)

3. **Set up environment variables**:
   - Go to Project Settings → Environment Variables
   - Add the same environment variables as listed in the Netlify section

4. **Deploy**:
   - Vercel will automatically deploy your project and serverless functions

## Email Service Options

### Option 1: SMTP Service (Recommended for Production)

For production use, we recommend using a dedicated email service:

- **SendGrid**: [sendgrid.com](https://sendgrid.com/)
- **Mailgun**: [mailgun.com](https://www.mailgun.com/)
- **Amazon SES**: [aws.amazon.com/ses](https://aws.amazon.com/ses/)

These services provide reliable delivery, monitoring, and better deliverability.

### Option 2: Gmail SMTP (Good for Testing)

For development or low-volume use, you can use Gmail SMTP:

1. Create a Gmail account for your application
2. Enable "Less secure app access" or use an App Password
3. Use the following settings:
   - SMTP_HOST: smtp.gmail.com
   - SMTP_PORT: 587
   - SMTP_SECURE: false
   - SMTP_USER: your.email@gmail.com
   - SMTP_PASSWORD: your-password-or-app-password

## Testing the Email Functionality

After deployment, you can test the email functionality:

1. Complete the CNAMM Quick Assessment
2. On the results page, enter your email in the "Save Your Results" section
3. Click "Send Results"
4. Verify that you receive the assessment results email

## Troubleshooting

If emails aren't being sent:

1. **Check environment variables**:
   - Verify all required environment variables are set correctly
   - Make sure SMTP_PORT is a number without quotes in the platform UI

2. **Check SMTP credentials**:
   - Test your SMTP credentials separately using a tool like [Nodemailer app](https://nodemailer.com/app/)

3. **Review function logs**:
   - Netlify: Go to Functions → Logs
   - Vercel: Go to Deployments → Select deployment → View Function Logs

4. **Test API endpoint directly**:
   - Use a tool like Postman to send a POST request to your API endpoint
   - Endpoint: `https://your-site.netlify.app/api/send-results`
   - Method: POST
   - Body: JSON with email, name, assessmentResults, and htmlContent fields

## Security Considerations

- Never commit your SMTP credentials to the repository
- Consider using environment-specific credentials
- For production, use a dedicated email address for sending assessment results
- Implement rate limiting to prevent abuse
- Regularly rotate your SMTP credentials

## Need Help?

If you encounter issues setting up the email functionality, please:

- Check the [GitHub Issues](https://github.com/devsecflow/Cloud-Native-Assurance-Maturity-Model/issues) for known problems
- Create a new issue with detailed information about your problem
- Contact us at info@devsecflow.com for direct assistance