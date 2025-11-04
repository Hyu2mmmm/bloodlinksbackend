import express from "express";
import { sendOtp } from "./mailer.js";
import admin from "./config.js"; // Firebase Admin
import nodemailer from "nodemailer";

const router = express.Router();

// Temporary in-memory OTP store
const otpStore = {};
const db = admin.firestore(); // ✅ Firestore reference

// ============================================================
// 🔹 SEND OTP (Block old or used emails)
// ============================================================
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // 🔍 Check if user already exists in Firebase
    const existingUser = await admin.auth().getUserByEmail(email).catch(() => null);
    if (existingUser) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    // 🔍 Check Firestore if email was used before
    const usedEmailDoc = await db.collection("usedEmails").doc(email).get();
    if (usedEmailDoc.exists) {
      return res
        .status(400)
        .json({ message: "This email has already been used and cannot register again." });
    }

    // ✅ Generate and store OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    // Send the OTP via email
    await sendOtp(email, otp);
    console.log(`✅ OTP sent to ${email}: ${otp}`);

    res.json({ message: "OTP sent successfully!" });
  } catch (err) {
    console.error("❌ OTP Sending Error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

// ============================================================
// 🔹 VERIFY OTP (Mark email as permanently used)
// ============================================================
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record) return res.status(400).json({ message: "No OTP found for this email" });
  if (Date.now() > record.expires) return res.status(400).json({ message: "OTP expired" });
  if (record.otp.toString() !== otp.toString()) return res.status(400).json({ message: "Invalid OTP" });

  try {
    // ✅ Mark the email as permanently used in Firestore
    await db.collection("usedEmails").doc(email).set({
      used: true,
      verifiedAt: new Date().toISOString(),
    });

    delete otpStore[email];
    console.log(`✅ OTP verified and email locked: ${email}`);
    res.json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("❌ Firestore Error:", error);
    res.status(500).json({ message: "Failed to verify OTP", error: error.message });
  }
});

// ============================================================
// 🔹 RESET PASSWORD (Forgot Password Only)
// ============================================================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, { password: newPassword });
    await admin.auth().revokeRefreshTokens(user.uid);

    await sendConfirmationEmail(email);

    console.log(`✅ Password updated and tokens revoked for ${email}`);
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("❌ Reset Password Error:", error);
    return res.status(500).json({ message: "Failed to reset password", error: error.message });
  }
});

// ============================================================
// 🔸 Helper - Password Reset Confirmation Email
// ============================================================
async function sendConfirmationEmail(toEmail) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"BloodLinks" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "BloodLinks Password Reset Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color:#a80000;">Password Reset Successful</h2>
        <p>Your BloodLinks account password has been successfully updated.</p>
        <p>If this wasn’t you, please contact our support immediately.</p>
        <br><hr>
        <p style="font-size:12px; color:#999;">This is an automated message — please do not reply.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export default router;
