import jwt from "jsonwebtoken";

// Debug the environment variable
console.log("JWT Helper - JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT Helper - Using fallback?", !process.env.JWT_SECRET);

const secretKey = process.env.JWT_SECRET || "your-secret-key";
console.log("JWT Helper - Final secret key:", secretKey);

export const generateToken = (user) => {
    console.log("Generating token with secret:", secretKey);
    return jwt.sign(
        { id: user.id, email: user.email, phone: user.phone },
        secretKey,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, secretKey);
};