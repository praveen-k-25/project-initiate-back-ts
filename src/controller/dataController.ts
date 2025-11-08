import { ObjectId } from "mongodb";
import type { Request, Response } from "express";
import { movingReportData, playbackData } from "../functions/movingData.js";
import { getCollection } from "../models/dbModel.js";

const liveDatabase = getCollection(process?.env?.["DATA_COLLECTION"] || "");
const userDatabse = getCollection(process?.env?.["USER_COLLECTION"] || "");

const reportData = async (req: Request, res: Response) => {
  const { user, startDate, endDate, status } = req.body;

  const rawData = await liveDatabase
    .find({
      user: user,
      timestamp: {
        $gte: startDate,
        $lt: endDate,
      },
      status: status,
    })
    .project({ lat: 1, lng: 1, timestamp: 1, speed: 1 })
    .limit(10)
    .toArray();

  const resultData = movingReportData(rawData);
  res.status(200).json({
    success: true,
    data: resultData,
  });
};

const playbackReport = async (req: Request, res: Response) => {
  const { user, startDate, endDate } = req.body;

  const rawData = await liveDatabase
    .find({
      user: user,
      timestamp: {
        $gte: new Date(startDate).getTime(),
        $lt: new Date(endDate).getTime(),
      },
      status: 1,
    })
    .project({ lat: 1, lng: 1, timestamp: 1, speed: 1 })
    .toArray();

  const resultData = playbackData(rawData);
  res.status(200).json({
    success: true,
    data: resultData,
  });
};

const dashboardVehicles = async (req: Request, res: Response) => {
  const { user } = req.body;

  const vehicleList = await userDatabse.findOne({
    _id: new ObjectId(user),
  });

  let result = [];
  for (let vehicle of vehicleList.vehicles) {
    let data = await liveDatabase.findOne(
      {
        user: vehicle.toString(),
      },
      { sort: { timestamp: -1 } }
    );
    data && result.push(data);
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

export { reportData, playbackReport, dashboardVehicles };
