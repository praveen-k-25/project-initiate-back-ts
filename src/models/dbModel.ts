import { getDB } from "../database/db.js";

const getCollection = (collection: string) => {
  return getDB().collection(collection);
};

export { getCollection };
