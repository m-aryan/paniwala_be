import jwt from "jsonwebtoken";

// HARDCODED - DO NOT use process.env here
const secretKey = "yourSuperSecretKey";

console.log("Auth middleware loaded with secret:", secretKey);

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("=== AUTH MIDDLEWARE DEBUG ===");
    console.log("Secret Key being used:", secretKey);
    console.log("Token received:", token);

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        console.log(decoded.company_id);
        console.log("Token verified successfully:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("[JWT ERROR]", err.message);
        console.error("Secret used for verification:", secretKey);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};