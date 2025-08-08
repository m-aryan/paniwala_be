import express from "express";

import { login, signup } from "../controller/userController.js";

const router = express.Router();

router.post('/login', login);
router.post('/signup', signup);
// router.post('/verify-otp', verifyOTP);
// router.post('/user', user);
// router.post('/refresh-token', refreshToken);
// router.post('/register', register);
// router.post('/getProfile', authMiddleware, getProfile);


export default router;