import nodemailer from "nodemailer";
import { config } from "./config.js";

export const sendOtp = async (email, otp) => {
  try {
    console.log(`📧 Sending OTP to: ${email}`);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587, // TLS port (more reliable on Render)
      secure: false, // use STARTTLS instead of SSL
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
      tls: {
        rejectUnauthorized: false, // allow Render to connect even with self-signed certs
      },
    });

    // Optional: Verify connection
    await transporter.verify();
    console.log("✅ Gmail SMTP connection verified successfully!");

    const mailOptions = {
      from: `"BloodLinks Verification" <${config.emailUser}>`,
      to: email,
      subject: "Your OTP Code for BloodLinks",
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;">
          <h2>🔐 Email Verification</h2>
          <p>Your OTP code is:</p>
          <h1 style="color:#d32f2f;">${otp}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}: ${info.response}`);

    return true;
  } catch (error) {
    console.error("❌ Mailer error details:", error);
    throw new Error(error.message || "Failed to send OTP email");
  }
};
