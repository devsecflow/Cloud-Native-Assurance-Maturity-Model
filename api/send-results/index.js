const nodemailer = require('nodemailer');

// Create a serverless function to handle email sending
exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body);
    const { name, email, assessmentResults, htmlContent } = data;

    if (!email || !assessmentResults) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required fields' })
      };
    }

    // Configure email transporter (you'll need to set up environment variables)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"CNAMM Assessment" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Your CNAMM Assessment Results',
      html: htmlContent || generateDefaultEmailContent(name, assessmentResults),
      attachments: [
        {
          filename: 'cnamm-logo.png',
          path: 'https://devsecflow.github.io/cnamm/assets/images/icons/cnamm-logo.png',
          cid: 'cnamm-logo'
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: 'Email sent successfully', 
        messageId: info.messageId 
      })
    };
  } catch (error) {
    console.error('Email error:', error);
    
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error sending email', 
        error: error.message 
      })
    };
  }
};

// Fallback email generator if no HTML content is provided
function generateDefaultEmailContent(name, results) {
  const userName = name || 'User';
  const score = results.overallMaturity || '0.0';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Your CNAMM Assessment Results</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #2c6fad; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .score { font-size: 36px; font-weight: bold; text-align: center; color: #2c6fad; }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="cid:cnamm-logo" alt="CNAMM Logo" style="height: 60px;">
        <h1>Your CNAMM Assessment Results</h1>
      </div>
      <div class="content">
        <p>Dear ${userName},</p>
        <p>Thank you for completing the CNAMM Quick Assessment. Your overall maturity score is:</p>
        <div class="score">${score} / 4.0</div>
        <p>To gain deeper insights into your Cloud Native security posture, download the full CNAMM Assessment Toolkit.</p>
        <p style="text-align: center; margin-top: 30px;">
          <a href="https://github.com/devsecflow/Cloud-Native-Assurance-Maturity-Model/raw/main/release/v1.1/CNAMM%20Assessment%20Toolkit%20v1.1.xlsx" 
             style="background-color: #5b9a6f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Download Full CNAMM Toolkit
          </a>
        </p>
      </div>
    </body>
    </html>
  `;
}