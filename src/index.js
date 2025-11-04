// src/index.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "./config.js";
import otpRoutes from "./otpRoutes.js";

const app = express();

/* -------------------------------------------
   ✅ CORS Configuration
------------------------------------------- */
const allowedOrigins = [
  "http://localhost:8100",        // Ionic dev server
  "http://127.0.0.1:8100",
  "capacitor://localhost",        // Android/iOS Capacitor
  "https://otp-email.onrender.com" // Render backend URL
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

/* -------------------------------------------
   ✅ Request Logger (for debugging)
------------------------------------------- */
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

/* -------------------------------------------
   ✅ Health Check Route
------------------------------------------- */
app.get("/", (req, res) => {
  res.send("✅ OTP Email Backend is running successfully on Render!");
});

/* -------------------------------------------
   ✅ OTP API Routes
------------------------------------------- */
app.use("/api", otpRoutes);

/* -------------------------------------------
   ✅ 404 Handler
------------------------------------------- */
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

/* -------------------------------------------
   ✅ Start the Server
------------------------------------------- */
app.listen(config.port || 5000, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${config.port || 5000}`);
});
