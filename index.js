import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import userRoutes from './src/routes/userRoutes.js';
import iotRoutes from './src/routes/iotRoutes.js';
import alertRoutes from './src/routes/alertRoutes.js';
import enquiryRoutes from './src/routes/enquiryRoutes.js';
import resourceRoutes from "./src/routes/resourceRoutes.js";
import zoneRoutes from "./src/routes/zoneRoutes.js";
import floorMapRoutes from "./src/routes/floorMapRoutes.js";
// Load .env
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: true });
    console.log("[DEBUG] .env loaded");
} else {
    console.error("[ERROR] .env file not found!");
}

const app = express();

// public folder for pssword reset page
const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log("Created public folder");
}

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
    console.log("Created uploads folder");
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // serve uploaded files


// server static files
app.use(express.static(path.join(process.cwd(), "public"))); // Password reset page
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));



// Routes
app.use('/users', userRoutes);
app.use('/iot', iotRoutes);
app.use('/alerts', alertRoutes);
app.use('/enquiry', enquiryRoutes);
app.use("/resource", resourceRoutes);
app.use("/zone", zoneRoutes);
app.use("/floor", floorMapRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
