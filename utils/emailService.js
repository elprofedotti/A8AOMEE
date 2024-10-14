const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.sendVerificationEmail = (email, userId) => {
  const mailOptions = {
    from: '"OFFER ME" <noreply@offerme.com>',
    to: email,
    subject: 'Verify Your Email',
    html: `
      <h1>Welcome to OFFER ME!</h1>
      <p>Please click the link below to verify your email address:</p>
      <a href="${process.env.BASE_URL}/verify-email/${userId}">Verify Email</a>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};

exports.sendPasswordResetEmail = (email, token) => {
  const mailOptions = {
    from: '"OFFER ME" <noreply@offerme.com>',
    to: email,
    subject: 'Reset Your Password',
    html: `
      <h1>Password Reset Request</h1>
      <p>Please click the link below to reset your password:</p>
      <a href="${process.env.BASE_URL}/reset-password/${token}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending password reset email:', error);
    } else {
      console.log('Password reset email sent:', info.response);
    }
  });
};