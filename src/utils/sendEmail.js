// utils/sendEmail.js

const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Load environment variables
dotenv.config();



// 1. Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
    throw new Error("❌ Missing EMAIL_FROM or EMAIL_PASSWORD in .env file");
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,      // your Gmail
      pass: process.env.EMAIL_PASSWORD   // app password from Google
    }
  });
};

// 2. Generate verification token
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 3. Send verification email
const sendVerificationEmail = async (email, fullName, verificationToken) => {
  const transporter = createTransporter();

  const verificationUrl = `${process.env.BACKEND_URL}/verify-email?token=${verificationToken}`;

  const mailOptions = {
    from: `"EdTrack" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Please verify your email address',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <h2 style="color: #333;">Welcome to EdTrack, ${fullName}!</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #007bff; color: white; padding: 12px 30px; 
                    text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>

        <p>Or copy and paste this link in your browser:</p>
        <p style="word-break: break-all; color: #007bff;">${verificationUrl}</p>

        <p style="color: #666; font-size: 14px;">
          This verification link will expire in 24 hours. If you didn't create an account, 
          please ignore this email.
        </p>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #999; font-size: 12px;">
          This email was sent from Our Platform. Please do not reply to this email.
        </p>
      </div>
    `,
    text: `
      Welcome ${fullName}!
      
      Please verify your email address by visiting: ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you didn't create an account, please ignore this email.
    `
  };

  try {
    console.log('📤 Attempting to send email to:', email);
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent: ${info.response}`);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw new Error('Could not send verification email');
  }
};

// Export functions
module.exports = {
  createTransporter,
  generateVerificationToken,
  sendVerificationEmail
};
