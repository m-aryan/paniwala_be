import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";

import { login, signup, getCompanies, updateUserDevice, getUserProfile, updateProfile } from "../controller/userController.js";

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
router.get('/getCompanies', getCompanies);
router.post('/updateProfile', updateProfile);
router.post('/updateDevice', updateUserDevice);
router.post('/getProfile', authenticateToken,getUserProfile);
// router.post('/user', user);
// router.post('/refresh-token', refreshToken);
// router.post('/register', register);


export default router;