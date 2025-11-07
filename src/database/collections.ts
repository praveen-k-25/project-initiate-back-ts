const {getDB} = require("./db");

const registerCollection = async () => {
  const db = getDB();
  const collection = await db.collection("users");
  return collection;
};

module.exports = {
  registerCollection,
};
