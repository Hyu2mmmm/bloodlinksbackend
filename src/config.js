// src/config.js
import dotenv from "dotenv";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// ✅ Handle ESM paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Path to Firebase Admin key
const serviceAccountPath = path.join(__dirname, "../serviceAccountKey.json");

// ✅ Read JSON manually (avoids import assertions issue)
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// ✅ Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ✅ Export config and admin
export const config = {
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  port: process.env.PORT || 5000,
  firebaseAdmin: admin,
};

export default admin;
