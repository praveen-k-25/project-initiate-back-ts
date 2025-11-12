import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { connectDB } from "./database/database.js";
import ensureIndex from "./utils/indexing.js";
import { userRouter } from "./routes/userRoutes.js";
import { dataRouter } from "./routes/dataRouter.js";
import { globalErrorHandler } from "./middleware/ErrorHandler.js";
import { keepServerAwake } from "./utils/keepserverAwake.js";

const app = express();
app.use(express.json());

// Connect to Database
await connectDB();
await ensureIndex();

// CORS Configuration
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

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
  keepServerAwake();
});
