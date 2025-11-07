function getDateTime(startDate) {
  return `${startDate.getFullYear()}-${
    startDate.getMonth() + 1 < 10
      ? `0${startDate.getMonth() + 1}`
      : startDate.getMonth() + 1
  }-${
    startDate.getDate() < 10 ? `0${startDate.getDate()}` : startDate.getDate()
  } ${
    startDate.getHours() < 10
      ? `0${startDate.getHours()}`
      : startDate.getHours()
  }:${
    startDate.getMinutes() < 10
      ? `0${startDate.getMinutes()}`
      : startDate.getMinutes()
  }:${
    startDate.getSeconds() < 10
      ? `0${startDate.getSeconds()}`
      : startDate.getSeconds()
  }`;
}

function getTimeDifference(startTime, endTime) {
  let difference = (endTime - startTime) / 1000;
  let hours = Math.floor(difference / 3600).toFixed(0);
  let minutes = Math.floor((difference % 3600) / 60).toFixed(0);
  let seconds = (difference % 60).toFixed(0);
  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
}

function movingReportData(data) {
  let previousData;
  let currentData = {};
  let resultData = [];
  const difference = 3 * 60 * 1000;

  data.forEach((item, index) => {
    if (Object.entries(currentData).length === 0) {
      currentData.user = item.user;
      currentData.startDate = item.timestamp;
      previousData = item;
      return;
    }

    if (
      item.timestamp - previousData.timestamp > difference ||
      index === data.length - 1
    ) {
      if (currentData.endDate) {
        currentData.difference = getTimeDifference(
          currentData.startDate,
          currentData.endDate
        );
        currentData.startDate = getDateTime(new Date(currentData.startDate));
        currentData.endDate = getDateTime(new Date(currentData.endDate));

        delete currentData.startTimestamp;
        delete currentData.endTimestamp;
        resultData.push(currentData);
        currentData = {};
      } else {
        Object.keys(currentData).forEach((key) => delete currentData[key]);
        currentData = {};
      }
    }

    if (
      item.timestamp - previousData.timestamp > 1000 &&
      item.timestamp - previousData.timestamp <= difference
    ) {
      previousData = item;
      currentData.endDate = item.timestamp;
    }
  });

  return resultData;
}

function playbackReportData(data) {
  let previousData;
  let currentData = [];
  let resultData = [];
  const difference = 60 * 1000;

  data.forEach((item, index) => {
    if (Object.entries(currentData).length === 0) {
      currentData.push({
        lat: item.lat,
        lng: item.lng,
      });
      previousData = item;
      return;
    }

    if (
      item.timestamp - previousData.timestamp > difference ||
      index === data.length - 1
    ) {
      if (currentData.length > 0) {
        resultData.push(currentData);
        currentData.push({
          lat: item.lat,
          lng: item.lng,
        });
        currentData = [];
        return;
      } else {
        currentData = [];
      }
    }

    if (
      item.timestamp - previousData.timestamp > 1000 &&
      item.timestamp - previousData.timestamp <= difference
    ) {
      currentData.push({
        lat: item.lat,
        lng: item.lng,
      });
      previousData = item;
    }
  });

  return resultData;
}

module.exports = {
  movingReportData,
  playbackReportData,
  getDateTime,
  getTimeDifference,
};
