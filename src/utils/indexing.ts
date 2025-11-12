import { getCollection } from "../database/collection.js";

export default async function ensureIndex(): Promise<void> {
  const dataCollection = process.env.DATA_COLLECTION;

  if (!dataCollection) {
    throw new Error(
      "Collection names are not defined in environment variables"
    );
  }

  const dataIndexes = getCollection(dataCollection);

  await Promise.all([
    dataIndexes.createIndex({ status: 1, timestamp: 1 }),
    dataIndexes.createIndex({
      user: 1,
      timestamp: 1,
      status: 1,
    }),
  ]);
}
