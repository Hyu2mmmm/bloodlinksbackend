// src/mailer.js
import { Resend } from "resend";
import { config } from "./config.js";

const resend = new Resend(config.resendApiKey);

export async function sendOtp(email, otp) {
  try {
    console.log(`📧 Sending OTP to: ${email}`);

    const response = await resend.emails.send({
      from: "BloodLinks <onboarding@resend.dev>",
      to: email,
      subject: "Your BloodLinks OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px;">
          <h2>🔐 Your OTP Code</h2>
          <p>Here’s your BloodLinks verification code:</p>
          <h1 style="color: #e53935; font-size: 36px;">${otp}</h1>
          <p>This code will expire in <b>5 minutes</b>.</p>
        </div>
      `,
    });

    console.log("✅ Resend API response:", response);
  } catch (error) {
    console.error("❌ Mailer error details:", error);
    throw new Error(error.message || "Failed to send OTP email");
  }
}
