import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from "path";
import fs from 'fs';

import userRoutes from './src/routes/userRoutes.js';
import iotRoutes from './src/routes/iotRoutes.js';
import alertRoutes from './src/routes/alertRoutes.js';
import enquiryRoutes from './src/routes/enquiryRoutes.js';

// Resolve .env path
const envPath = path.resolve(process.cwd(), '.env');

// Load .env
if (fs.existsSync(envPath)) { 
    console.log('[DEBUG] .env file exists. Loading...');
    dotenv.config({ path: envPath, override: true });
} else {
    console.error('[ERROR] .env file not found!');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);
app.use('/iot', iotRoutes);
app.use('/alerts', alertRoutes);
app.use('/enquiry', enquiryRoutes);
// app.use('/lfs/api/service', serviceRequestRoutes);
// app.use('/lfs/api/subscription', subscriptionRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
