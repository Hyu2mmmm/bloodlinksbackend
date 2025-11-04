// src/mailer.js
import nodemailer from "nodemailer";
import { config } from "./config.js";

// ✅ Create reusable transporter with connection pool
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
  pool: true,           // Reuse connections for faster delivery
  maxConnections: 5,    // Keep up to 5 SMTP connections alive
  rateDelta: 1000,      // 1 second window
  rateLimit: 3,         // Max 3 emails per second
});

// ✅ Improved sendOtp with error handling and async logging
export async function sendOtp(email, otp) {
  const mailOptions = {
    from: `"BloodLinks Support" <${config.emailUser}>`,
    to: email,
    subject: "Your BloodLinks OTP Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>🔐 OTP Verification</h2>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="color:#e63946;">${otp}</h1>
        <p>This code will expire in <b>5 minutes</b>.</p>
        <br />
        <p style="font-size:12px; color:#777;">Do not share this code with anyone.</p>
      </div>
    `,
  };

  try {
    // ⚡ Send asynchronously (non-blocking)
    transporter.sendMail(mailOptions)
      .then(() => console.log(`✅ OTP sent successfully to ${email}`))
      .catch((err) => console.error(`❌ Failed to send OTP to ${email}:`, err.message));
  } catch (error) {
    console.error("❌ Unexpected error while sending OTP:", error.message);
  }
}
