import { Collection, Document as MongoDocument } from "mongodb";
import { getDB } from "./database.js";

const getCollection = <T extends MongoDocument>(
  collectionName: string
): Collection<T> => {
  return getDB().collection<T>(collectionName);
};

export { getCollection };
