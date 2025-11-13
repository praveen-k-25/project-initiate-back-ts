import { ObjectId, Document as MongoDocument } from "mongodb";

export interface UserData {
  _id: ObjectId;
  username: string;
  email: string;
  password: string;
  vehicles: {
    id: ObjectId;
    username: string;
  }[];
}

export interface Reports extends MongoDocument {
  _id: ObjectId;
  user: string;
  timestamp: number;
  lat: number;
  lng: number;
  speed: number;
  status: number;
}

export interface ReportsDataPoint {
  _id: ObjectId;
  user: string;
  timestamp: number;
  lat: number;
  lng: number;
  speed: number;
}

export interface PlaybackDataPoint {
  _id: ObjectId;
  timestamp: number;
  lat: number;
  lng: number;
  speed: number;
}
