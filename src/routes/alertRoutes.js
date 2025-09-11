import express from "express";
import { getAllAlertHistory } from "../controller/alertController.js";

const alertRouter = express.Router();
alertRouter.get("/alertHistory", getAllAlertHistory);

export default alertRouter;