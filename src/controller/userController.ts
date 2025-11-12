import type { Request, Response } from "express";
import {
  verifyForgotPasswordOtp,
  verifyRegisterOtp,
} from "./mailController.js";
import { ObjectId } from "mongodb";
import { AppError, asyncHandler } from "../middleware/ErrorHandler.js";
import { hashPassword, VerifyPassword } from "../utils/Hashing.js";
import { accessToken, refreshToken } from "../utils/TokenHandler.js";
import { getCollection } from "../database/collection.js";
import { UserData } from "../types/controllerTypes.js";

// register user
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password, otp } = req.body;

  const verified = await verifyRegisterOtp({ email, otp });
  if (!verified) throw new AppError("Invalid OTP", 400, "otp");

  const hashedPassword = await hashPassword(password);
  await getCollection(process.env.USER_COLLECTION!).insertOne({
    username,
    email,
    password: hashedPassword,
  });

  let masterID = await getCollection(process.env.USER_COLLECTION!).findOne({
    email: process.env.MASTER_EMAIL!,
  });

  const user = await getCollection(process.env.USER_COLLECTION!).findOne({
    email,
  });

  if (
    !masterID?.vehicles?.some(
      (id: number) => id.toString() === user?._id.toString()
    )
  ) {
    let userCollection = getCollection<UserData>(process.env.USER_COLLECTION!);
    await userCollection.updateOne(
      { _id: masterID?._id },
      { $push: { vehicles: user?._id } }
    );
  }

  if (
    !user?.vehicles?.some(
      (id: number) => id.toString() === user?._id.toString()
    )
  ) {
    await getCollection<UserData>(process.env.USER_COLLECTION!).updateOne(
      { _id: user?._id },
      { $push: { vehicles: user?._id } }
    );
  }

  res.status(200).json({ success: true, message: "User registered" });
});

// login user

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await getCollection(process.env.USER_COLLECTION!).findOne({
    email,
  });

  if (!user) throw new AppError("User not found", 400, "email");

  const isMatch = await VerifyPassword(user.password, password);
  if (!isMatch) throw new AppError("Invalid Password", 400, "password");

  if (!user.vehicles) {
    user = await getCollection(process.env.USER_COLLECTION!).findOneAndUpdate(
      { _id: new ObjectId(user._id) },
      {
        $set: {
          vehicles: [user._id],
        },
      },
      {
        returnDocument: "after",
        projection: { username: 1, email: 1, id: 1, vehicles: 1 },
      }
    );
  }

  res.cookie("accessId", accessToken(user), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.cookie("refreshId", refreshToken(user), {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    success: true,
    message: "User logged in Successfully",
    data: {
      username: user?.username,
      email: user?.email,
      id: user?._id,
      vehicles: user?.vehicles || [],
    },
  });
});

// forgot password

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, newPassword, otp } = req.body;

  const verify = await verifyForgotPasswordOtp({ email, otp });
  if (!verify) throw new AppError("Invalid OTP", 400, "otp");

  const hashedPassword = await hashPassword(newPassword);
  await getCollection(process.env.USER_COLLECTION!).updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );
  res.status(200).json({ success: true, message: "Password changed" });
});

export { registerUser, loginUser, forgotPassword };
