import { getCollection } from "./dbModel.js";

const registerModel = async (collectionName: string, value: any) => {
  const collection = await getCollection(collectionName);
  collection.createIndex({ email: 1 }, { unique: true });
  return await collection.insertOne(value);
};

export { registerModel };
