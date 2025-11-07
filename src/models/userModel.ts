const {getCollection} = require("./dbModel");

const registerModel = async (collectionName, value) => {
  const collection = await getCollection(collectionName);
  collection.createIndex({email: 1}, {unique: true});
  return await collection.insertOne(value);
};

module.exports = {registerModel};