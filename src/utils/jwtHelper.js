import jwt from "jsonwebtoken";

// Debug the environment variable
console.log("JWT Helper - JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT Helper - Using fallback?", !process.env.JWT_SECRET);

// Use environment variable or fallback
const secretKey = process.env.JWT_SECRET || "yourSuperSecretKey";
console.log("JWT Helper - Final secret key:", secretKey);

// Generate JWT token with full payload
export const generateToken = (user) => {
    console.log("Generating token with payload:", user);

    // Sign the entire user payload (only include necessary fields)
    const payload = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        role: user.role,
        company_id: user.company_id, // important
    };

    return jwt.sign(payload, secretKey, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });
};

// Verify token
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, secretKey);
        console.log("Token verified successfully:", decoded);
        return decoded;
    } catch (err) {
        console.error("[JWT ERROR]", err.message);
        throw err;
    }
};
