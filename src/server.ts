// src/server.js
import "dotenv/config"; // automatically runs dotenv.config()
import type { Request, Response } from "express";
import express from "express";
import cors from "cors";
import { connectDB } from "./database/db.js";
import { globalErrorHandler } from "./middleware/ErrorHandler.js";
import ensureIndexes from "./utils/indexing.js";
import { userRouter } from "./routes/userRoutes.js";
import { dataRouter } from "./routes/dataRouter.js";
import { keepServerAwake } from "./utils/keepserverAwake.js";

const app = express();
// connect to database
connectDB();

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://1d2103g4-5173.inc1.devtunnels.ms",
      "https://57t8fp3l-5173.inc1.devtunnels.ms",
      "https://project-initiate.onrender.com",
      "https://metromicron.netlify.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

await ensureIndexes();

// routes
app.use("/user", userRouter);
app.use("/data", dataRouter);

// self-ping
app.get("/keep-alive", (req: Request, res: Response) => {
  const {} = req.body;
  res.status(200).json({ success: true, status: 200 });
});

// captures all errors
app.use(globalErrorHandler);

// catch unhandled promise rejections
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

// server listening
app.listen(10000, () => {
  console.log(`Server running on port ${process.env["PORT"]}`);
  keepServerAwake();
});
