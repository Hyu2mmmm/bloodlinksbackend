import nodemailer from "nodemailer";
import { config } from "./config.js";

export const sendOtp = async (email, otp) => {
  try {
    console.log(`📧 Preparing to send OTP to: ${email}`);
    console.log("📦 Using email user:", config.emailUser ? "Loaded ✅" : "Missing ❌");

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use SSL for Gmail
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });

    // Verify transporter connection before sending
    await transporter.verify();
    console.log("✅ Gmail SMTP connection verified successfully!");

    const mailOptions = {
      from: `"BloodLinks Verification" <${config.emailUser}>`,
      to: email,
      subject: "Your OTP Code for BloodLinks",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;">
          <h2>🔐 Email Verification</h2>
          <p>Here is your OTP code:</p>
          <h1 style="color:#d32f2f;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent to ${email}: ${info.response}`);

    return true;
  } catch (error) {
    console.error("❌ Mailer error details:", error);
    throw new Error(error.message || "Failed to send OTP email");
  }
};
