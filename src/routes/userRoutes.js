import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

import {
    login, signup, getCompanies,
    updateUserDevice, getUserProfile, updateProfile,
    forgotPassword, resetPassword
} from "../controller/userController.js";

const router = express.Router();

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/signup', signup);
router.post('/updateProfile', updateProfile);
router.post('/updateDevice', updateUserDevice);
router.post('/getProfile', authenticateToken, getUserProfile);

router.get('/getCompanies', getCompanies);

export default router;