import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  console.log("=== FILE UPLOAD DEBUG ===");
  console.log("Field name:", file.fieldname);GI
  console.log("Original name:", file.originalname);
  console.log("MIME type:", file.mimetype);
  console.log("File size:", file.size);

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];
  const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml", "image/webp"];
  
  const ext = path.extname(file.originalname).toLowerCase();
  const isValid = allowedMimeTypes.includes(file.mimetype) || allowedExtensions.includes(ext);

  if (!isValid) {
    console.log("File rejected - Invalid type or extension");
    return cb(new Error(`Only image files are allowed! Received: ${file.mimetype}, Extension: ${ext}`), false);
  }

  cb(null, true);
};

// Multer instance
const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

export default upload;
