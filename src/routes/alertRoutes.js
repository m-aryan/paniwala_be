import express from "express";
import { getAllAlertHistory, postZoneData, updateSilenceStatus, getZoneData } from "../controller/alertController.js";

const alertRouter = express.Router();
alertRouter.get("/alertHistory", getAllAlertHistory);

alertRouter.post("/zone-data", postZoneData);
alertRouter.patch("/zone-data", updateSilenceStatus);
alertRouter.get("/zone-data", getZoneData);

export default alertRouter;