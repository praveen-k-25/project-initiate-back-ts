import express from "express";
import {
  dashboardVehicles,
  playbackReport,
  reportData,
} from "../controller/dataController.js";

export const dataRouter = express.Router();

dataRouter.post("/moving", reportData);
dataRouter.post("/idle", reportData);
dataRouter.post("/playback", playbackReport);
dataRouter.post("/dashboardVehicle", dashboardVehicles);
