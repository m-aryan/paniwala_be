import express from "express";
import { addFloorMapAllTables, getFloorMapsByCompany } from "../controller/floorMapController.js";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Insert floor map
router.post(
  "/floor-map",
  authenticateToken,
  upload.fields([{ name: "floor_map_image", maxCount: 1 }]),
  addFloorMapAllTables
);

// Get all floor maps for logged-in company
router.get(
  "/floor-map",
  authenticateToken,
  getFloorMapsByCompany
);

export default router;
