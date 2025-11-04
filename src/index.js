// src/index.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "./config.js";
import otpRoutes from "./otpRoutes.js";

const app = express();

// ✅ Allow Ionic, Android, and Render access
const allowedOrigins = [
  "http://localhost:8100",
  "http://127.0.0.1:8100",
  "capacitor://localhost",
  "http://192.168.1.6:8100", // Replace with your LAN IP
  "https://otp-email.onrender.com", // Your Render backend
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

app.use(bodyParser.json());

// ✅ Log requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ✅ Single root route
app.get("/", (req, res) => {
  res.send("✅ OTP Email Backend is running successfully on Render!");
});

// ✅ Register OTP routes
app.use("/api", otpRoutes);

// ✅ Handle unknown routes
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ✅ Start server
app.listen(config.port, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${config.port}`);
});
