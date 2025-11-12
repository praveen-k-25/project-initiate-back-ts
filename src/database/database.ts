import { Db, MongoClient } from "mongodb";
let db: Db;

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL;
    if (!dbUrl) {
      throw new Error("DB_URL is not defined in environment variables");
    }
    // Simulate database connection
    const client = new MongoClient(dbUrl);
    await client.connect();
    db = client.db();
    console.log("Connected to Database");
  } catch (err) {
    console.error("Database connection error:", err);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected");
  }
  return db;
};

export { connectDB, getDB };
