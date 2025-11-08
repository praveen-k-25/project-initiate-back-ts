import type { reportData } from "../types/contoller_types.js";

export function getDateTime(startDate: Date) {
  const year = startDate.getFullYear();
  const month = startDate.getMonth() + 1;
  const date = startDate.getDate();
  const hours = startDate.getHours();
  const minutes = startDate.getMinutes();
  const seconds = startDate.getSeconds();

  return `${startDate.getFullYear()}-${
    year + 1 < 10 ? `0${year + 1}` : year + 1
  }-${month < 10 ? `0${month}` : month}-${date < 10 ? `0${date}` : date} ${
    hours < 10 ? `0${hours}` : hours
  }:${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
}

export function getTimeDifference(timestamp: number) {
  let diff = timestamp / 1000;

  let hours = Math.floor(diff / 3600);
  let minutes = Math.floor((diff % 3600) / 60);
  let seconds = Math.floor(diff % 60);

  return `${hours < 10 ? `0${hours}` : hours}:${
    minutes < 10 ? `0${minutes}` : minutes
  }:${seconds < 10 ? `0${seconds}` : seconds}`;
}

export function movingReportData(data: reportData[]) {
  let previousData: reportData | null = null;
  let currentData: any = null;
  let resultData: any[] = [];
  const difference = 5 * 60 * 1000;

  data.forEach((item: reportData, index: number) => {
    if (!currentData) {
      currentData.user = item.user;
      currentData.startTime = item.timestamp;
      previousData = item;
      return;
    }
    if (!previousData) return;

    if (
      item.timestamp - previousData.timestamp >= difference ||
      index === data.length - 1
    ) {
      if (currentData.endDate) {
        currentData.duration = getTimeDifference(
          currentData.endTime - currentData.startTime
        );
        currentData.startDate = getDateTime(new Date(currentData.startTime));
        currentData.endDate = getDateTime(new Date(currentData.endTime));

        delete currentData.startTime;
        delete currentData.endTime;
        resultData.push(currentData);
        currentData = {};
      } else {
        Object.keys(currentData).forEach((key) => delete currentData[key]);
        currentData = {};
      }
      return;
    }

    if (item.timestamp - previousData.timestamp > 60 * 1000) {
      previousData = item;
      currentData.endTime = item.timestamp;
    }
  });

  return resultData;
}

export function idleReportData(data: reportData[]) {
  let previousData: reportData | null = null;
  let currentData: any = null;
  let resultData: any[] = [];
  const difference = 5 * 60 * 1000;

  data.forEach((item: reportData, index: number) => {
    if (!currentData) {
      currentData.user = item.user;
      currentData.startTime = item.timestamp;
      previousData = item;
      return;
    }
    if (!previousData) return;

    if (
      item.timestamp - previousData.timestamp >= difference ||
      index === data.length - 1
    ) {
      if (currentData.endDate) {
        currentData.duration = getTimeDifference(
          currentData.endTime - currentData.startTime
        );
        currentData.startDate = getDateTime(new Date(currentData.startTime));
        currentData.endDate = getDateTime(new Date(currentData.endTime));

        delete currentData.startTime;
        delete currentData.endTime;
        resultData.push(currentData);
        currentData = {};
      } else {
        Object.keys(currentData).forEach((key) => delete currentData[key]);
        currentData = {};
      }
      return;
    }

    if (item.timestamp - previousData.timestamp > 60 * 1000) {
      previousData = item;
      currentData.endTime = item.timestamp;
    }
  });

  return resultData;
}

export function playbackData(data: any) {
  let previousData: reportData;
  let currentData: any = null;
  let resultData: any[] = [];
  const difference = 5 * 60 * 1000;

  data.forEach((item: reportData, index: number) => {
    if (!currentData) {
      currentData.startTime = item.timestamp;
      currentData.playback = [[item.lat, item.lng]];
      previousData = item;
      return;
    }

    if (
      item.timestamp - previousData.timestamp > difference ||
      index === data.length - 1
    ) {
      if (currentData.endDate && currentData.playback.length > 1) {
        currentData.duration = getTimeDifference(
          currentData.endTime - currentData.startTime
        );
        currentData.startDate = getDateTime(new Date(currentData.startTime));
        currentData.endDate = getDateTime(new Date(currentData.endTime));

        delete currentData.startTime;
        delete currentData.endTime;
        resultData.push(currentData);
        currentData = {};
      } else {
        Object.keys(currentData).forEach((key) => delete currentData[key]);
        currentData = {};
      }
      return;
    }

    if (item.timestamp - previousData.timestamp > 60 * 1000) {
      currentData.playback.push([item.lat, item.lng]);
      currentData.endTime = item.timestamp;
      previousData = item;
    }
  });

  return [];
}
