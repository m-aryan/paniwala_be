import express from "express";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { addResource, getResources, getResourceById } from "../controller/resourceController.js";

const router = express.Router();

// Centralized Multer error handler
const handleUploadError = (err, req, res, next) => {
    console.log("=== UPLOAD ERROR ===", err);
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ error: "File too large. Max size: 10MB" });
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ error: `Unexpected file field: ${err.field}` });
        }
    } else if (err.message.includes("Only image files are allowed")) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Upload failed", message: err.message });
};

// Single file upload with text fields
router.post(
    "/resources",
    authenticateToken,
    upload.fields([{ name: "img_url", maxCount: 1 }]), // file
    handleUploadError,
    addResource
);

router.get("/resources", authenticateToken, getResources);
router.get("/resources/:id", authenticateToken, getResourceById);

export default router;
