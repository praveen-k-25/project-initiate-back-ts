const {
  movingReport,
  playbackReport,
  dashboardVehicles,
} = require("../controller/dataController");

const dataRouter = require("express").Router();

dataRouter.post("/moving", movingReport);
dataRouter.post("/playback", playbackReport);
dataRouter.post("/dashboardVehicle", dashboardVehicles);

module.exports = dataRouter;
