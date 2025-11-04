// src/otpRoutes.js
import express from "express";
import { sendOtp } from "./mailer.js";

const router = express.Router();

// ✅ Temporary in-memory OTP store
const otpStore = {};

/* -------------------------------------------
   ✅ SEND OTP (Instant Response)
------------------------------------------- */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // expires in 5 min

    // Send immediate response to frontend
    res.json({ message: "OTP sent successfully!" });

    // ⚡ Send email in background (non-blocking)
    sendOtp(email, otp);
  } catch (err) {
    console.error("❌ OTP Sending Error:", err);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
});

/* -------------------------------------------
   ✅ VERIFY OTP
------------------------------------------- */
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  const record = otpStore[email];

  if (!record)
    return res.status(400).json({ message: "No OTP found for this email" });
  if (Date.now() > record.expires)
    return res.status(400).json({ message: "OTP expired" });
  if (record.otp.toString() !== otp.toString())
    return res.status(400).json({ message: "Invalid OTP" });

  delete otpStore[email];
  res.json({ message: "OTP verified successfully!" });
});

export default router;
