const { getDB } = require("../database/db");

const getCollection = (collection) => {
  return getDB().collection(collection);
};

module.exports = { getCollection };
