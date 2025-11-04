// src/mailer.js
import nodemailer from "nodemailer";
import { config } from "./config.js";

export const sendOtp = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP to: ${email}`);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    const mailOptions = {
      from: `"BloodLinks OTP Service" <${config.emailUser}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;">
          <h2>🔐 BloodLinks Email Verification</h2>
          <p>Your one-time password (OTP) is:</p>
          <h1 style="color:#d32f2f;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}: ${info.response}`);
  } catch (error) {
    console.error("❌ Mailer error details:", error);
    throw error;
  }
};
