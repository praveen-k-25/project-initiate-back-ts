import { ObjectId } from "mongodb";
import type { Request, Response } from "express";
import { movingReportData, playbackData } from "../functions/movingData.js";
import { getCollection } from "../database/collection.js";
import {
  UserData,
  PlaybackDataPoint,
  Reports,
  ReportsDataPoint,
} from "../types/controllerTypes.js";

const dataCollection = process.env.DATA_COLLECTION;
const userCollection = process.env.USER_COLLECTION;

const reportData = async (req: Request, res: Response) => {
  const { user, startDate, endDate, status } = req.body;
  console.log(req.body);

  const rawData = await getCollection<Reports>(dataCollection!)
    .find({
      user: user,
      timestamp: {
        $gte: startDate,
        $lt: endDate,
      },
      status: status,
    })
    .project<ReportsDataPoint>({
      user: 1,
      lat: 1,
      lng: 1,
      timestamp: 1,
      speed: 1,
    })
    .sort({ timestamp: 1 })
    .toArray();

  const resultData = movingReportData(rawData);
  res.status(200).json({
    success: true,
    data: resultData,
    rawData,
  });
};

const playbackReport = async (req: Request, res: Response) => {
  const { user, startDate, endDate } = req.body;

  const rawData = await getCollection<Reports>(dataCollection!)
    .find({
      user: user,
      timestamp: {
        $gte: startDate,
        $lt: endDate,
      },
      status: 1,
    })
    .project<PlaybackDataPoint>({ lat: 1, lng: 1, timestamp: 1, speed: 1 })
    .toArray();

  const resultData = playbackData(rawData);
  res.status(200).json({
    success: true,
    data: resultData,
  });
};

const dashboardVehicles = async (req: Request, res: Response) => {
  const { user } = req.body;

  const vehicleList = await getCollection<UserData>(userCollection!).findOne(
    { _id: new ObjectId(user) },
    { projection: { vehicles: 1, _id: 0 } } // include vehicles only, exclude _id if not needed
  );
  let result = [];

  if (vehicleList?.vehicles) {
    for (let vehicle of vehicleList?.vehicles) {
      let data = await getCollection(dataCollection!).findOne(
        {
          user: vehicle.id.toString(),
        },
        {
          sort: { timestamp: -1 },
          projection: {
            time: 1,
            user: 1,
            lat: 1,
            lng: 1,
            status: 1,
            speed: 1,
          },
        }
      );

      data && result.push({ ...data, username: vehicle.username });
    }
  }

  res.status(200).json({
    success: true,
    data: result,
  });
};

export { reportData, playbackReport, dashboardVehicles };
