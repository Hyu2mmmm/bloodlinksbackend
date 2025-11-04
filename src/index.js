// src/index.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "./config.js";
import otpRoutes from "./otpRoutes.js";

const app = express();

// ✅ Dynamic CORS: allow local dev, local network, and production
const allowedOrigins = [
  "http://localhost:8100",           // Ionic dev server
  "http://127.0.0.1:8100",           // Alternative local
  "capacitor://localhost",           // For Android/iOS builds (Capacitor)
  "http://192.168.1.6:8100",         // Replace with your LAN IP (same WiFi)
  "http://192.168.1.6",              // Optional direct IP access
  "https://your-production-domain.com", // When deployed
];

// ✅ Use custom CORS middleware for flexibility
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

// ✅ Parse JSON requests
app.use(bodyParser.json());

// ✅ Log requests for debugging (helps when testing from phone)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.headers.origin || "unknown origin"}`);
  next();
});

// ✅ Register OTP routes
app.use("/api", otpRoutes);

// ✅ Handle undefined routes gracefully
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start Express server
app.listen(config.port, "0.0.0.0", () => {
  console.log(`✅ Server running on: http://localhost:${config.port}`);
  console.log(`🌐 Accessible via LAN at: http://<your-local-IP>:${config.port}`);
  console.log(`⚙️  CORS enabled for: ${allowedOrigins.join(", ")}`);
});
