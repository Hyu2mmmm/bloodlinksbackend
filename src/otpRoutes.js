// src/otpRoutes.js
import express from "express";
import { sendOtp } from "./mailer.js";

const router = express.Router();

/* -------------------------------------------
   ✅ Route to send OTP (used by the app)
------------------------------------------- */
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendOtp(email, otp);
    console.log(`✅ OTP sent successfully to ${email}`);
    res.status(200).json({ message: "OTP sent successfully", otp });
  } catch (error) {
    console.error(`❌ Failed to send OTP to ${email}:`, error);
    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
});

/* -------------------------------------------
   🧪 Test Route (for debugging Resend)
------------------------------------------- */
router.get("/test-email", async (req, res) => {
  const testRecipient = "apostoljessicad@gmail.com"; // Change if needed
  const testOtp = "999999";

  try {
    console.log(`🚀 Sending test email to ${testRecipient}...`);
    await sendOtp(testRecipient, testOtp);
    res.status(200).json({
      message: `✅ Test email sent to ${testRecipient}`,
    });
  } catch (error) {
    console.error("❌ Test email failed:", error);
    res.status(500).json({
      message: "❌ Failed to send test email",
      error: error.message,
    });
  }
});

export default router;
