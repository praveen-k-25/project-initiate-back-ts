import { getCollection } from "../models/dbModel.js";

export default async function ensureIndexes() {
  const collection = getCollection(process?.env?.["DATA_COLLECTION"] || "");

  await Promise.all([
    collection.createIndex({ status: 1, timestamp: 1 }),
    collection.createIndex({ email: 1 }, { unique: true }),
  ]);
}
