// src/mailer.js
import nodemailer from "nodemailer";
import { config } from "./config.js";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

export async function sendOtp(email, otp) {
  const mailOptions = {
    from: `"BloodLinks" <${config.emailUser}>`,
    to: email,
    subject: "Your BloodLinks OTP Code",
    html: `<h3>Your OTP is <b>${otp}</b></h3><p>It will expire in 5 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`📧 OTP sent to ${email}`);
}
