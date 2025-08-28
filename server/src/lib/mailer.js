const nodemailer = require('nodemailer');

function createTransport() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  
  if (!host || !user || !pass) {
    console.warn('Email configuration missing. Check EMAIL_HOST, EMAIL_USER, EMAIL_PASS environment variables.');
    return null;
  }
  
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
  
  return transporter;
}

async function sendEmail(emailData) {
  const transporter = createTransport();
  
  if (!transporter) {
    console.error('Email transporter not available. Check email configuration.');
    throw new Error('Email service not configured');
  }

  try {
    const result = await transporter.sendMail(emailData);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
}

module.exports = { createTransport, sendEmail };

