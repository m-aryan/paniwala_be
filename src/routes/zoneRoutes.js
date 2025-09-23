import express from "express";
import { addZone, getZones, getZoneById } from "../controller/zoneController.js";

const router = express.Router();

router.post("/zones", addZone);       // Insert new zone
router.get("/zones", getZones);       // Get all zones
router.get("/zones/:id", getZoneById); // Get zone by ID

export default router;
