const { ObjectId } = require("mongodb");
const {
  movingReportData,
  playbackReportData,
} = require("../functions/movingData");
const { getCollection } = require("../models/dbModel");

const movingReport = async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log(req.headers);
  await getCollection(process.env.DATA_COLLECTION).createIndex({
    status: 1,
    timestamp: 1,
  });

  const rawData = await getCollection(process.env.DATA_COLLECTION)
    .find({
      timestamp: {
        $gte: startDate,
        $lt: endDate,
      },
      status: 1,
    })
    .project({ user: 1, lat: 1, lng: 1, timestamp: 1, speed: 1 })
    .limit(10)
    .toArray();

  //const resultData = movingReportData(rawData);
  res.status(200).json({
    success: true,
    data: rawData,
  });
};

const playbackReport = async (req, res) => {
  const { startDate, endDate } = req.body;
  await getCollection(process.env.DATA_COLLECTION).createIndex({
    user: 1,
    username: 1,
  });
  const rawData = await getCollection(process.env.DATA_COLLECTION)
    .find({
      timestamp: {
        $gte: new Date(startDate).getTime(),
        $lt: new Date(endDate).getTime(),
      },
    })
    .toArray();

  const resultData = playbackReportData(rawData);
  res.status(200).json({
    success: true,
    data: resultData,
  });
};

const dashboardVehicles = async (req, res) => {
  const { user } = req.body;

  const vehicleList = await getCollection(process.env.USER_COLLECTION).findOne({
    _id: new ObjectId(user),
  });

  let result = [];
  for (let vehicle of vehicleList.vehicles) {
    let data = await getCollection(process.env.DATA_COLLECTION).findOne(
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

module.exports = { movingReport, playbackReport, dashboardVehicles };
