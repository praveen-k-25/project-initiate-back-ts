import { getDB } from "./db.js";

export const registerCollection = async () => {
  const db = getDB();
  const collection = await db.collection("users");
  return collection;
};
