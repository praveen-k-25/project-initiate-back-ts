import mongodb from "mongodb";
let db;

const connectDB = async () => {
  try {
    const client = new mongodb.MongoClient(process.env.DB_URL);
    await client.connect();
    db = client.db();
  } catch (error) {
    console.log(error);
  }
};

const getDB = () => {
  if (!db) {
    let err = new Error();
    err.status = 500;
    err.message = "Database not connected";
    throw err;
  }
  return db;
};

export { connectDB, getDB };
