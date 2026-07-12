
const nodemailer = require('nodemailer');
const crypto = require('crypto');
 
// 1. Build the transporter lazily (only when first needed), and cache it.
//    IMPORTANT: if this was built eagerly at module-load time, it would read
//    process.env.EMAIL_USER / EMAIL_PASSWORD before dotenv.config() has run
//    (depending on require order in your entry file), permanently baking in
//    undefined credentials for the lifetime of the process.
let transporter = null;
 
function getTransporter() {
  if (!transporter) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error(
        'EMAIL_USER / EMAIL_PASSWORD are not set. Make sure dotenv.config() runs before anything else is required in your entry file.'
      );
    }
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,     // Your email address
        pass: process.env.EMAIL_PASSWORD  // Your App Password (not your primary password)
      }
    });
  }
  return transporter;
}
 
// 2. Generate a secure 6-digit OTP code
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}
 
// 3. Send the OTP code via email
async function sendOTPEmail(targetEmail, otpCode) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: targetEmail,
    subject: 'Your One-Time Password (OTP) Verification Code',
    text: `Your OTP verification code is ${otpCode}. It is valid for 5 minutes.`,
    html: `<p>Your OTP verification code is <b>${otpCode}</b>.</p><p>It will expire in 5 minutes.</p>`
  };
 
  try {
    const info = await getTransporter().sendMail(mailOptions);
    console.log('OTP Email successfully sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending OTP email: ', error);
    return false;
  }
}
 
module.exports = { generateOTP, sendOTPEmail };