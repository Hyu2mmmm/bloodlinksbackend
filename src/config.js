// src/config.js
import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  resendApiKey: process.env.RESEND_API_KEY, // 👈 add this
};
