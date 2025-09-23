
import express from "express";
import { addFloorMapAllTables } from "../controller/floorMapController.js";
import upload from "../middleware/upload.js"; // Import your upload middleware

const router = express.Router();

// Add multer middleware to handle file uploads
router.post("/floor-map", upload.fields([
  { name: 'floor_map_image', maxCount: 1 }
]), addFloorMapAllTables);

export default router;