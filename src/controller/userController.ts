import type { Request, Response } from "express";
import {
  verifyForgotPasswordOtp,
  verifyRegisterOtp,
} from "./mailController.js";
import { registerModel } from "../models/userModel.js";
import { ObjectId } from "mongodb";
import { asyncHandler } from "../middleware/ErrorHandler.js";
import { getCollection } from "../models/dbModel.js";
import { hashPassword, VerifyPassword } from "../utils/Hashing.js";
import { accessToken } from "../utils/TokenHandler.js";

const liveDatabase = getCollection(process?.env?.["DATA_COLLECTION"] || "");

// register user
const registerUser = async (req: Request, res: Response) => {
  const { username, email, password, otp } = req.body;
  const verified = await verifyRegisterOtp({ email, otp });

  if (!verified) {
    let error = new Error();
    //error.status = 400;
    error.cause = "otp";
    error.message = "Invalid OTP";
    throw error;
  }

  const hashedPassword = await hashPassword(password);
  await registerModel(process?.env?.["USER_COLLECTION"] || "", {
    username,
    email,
    password: hashedPassword,
  });

  let masterID = await liveDatabase.findOne({
    email: process?.env?.["MASTER_EMAIL"],
  });

  const user = await liveDatabase.findOne({
    email,
  });

  if (
    !masterID?.vehicles?.some(
      (id: number) => id.toString() === user._id.toString()
    )
  ) {
    await liveDatabase.updateOne(
      { _id: masterID?._id },
      { $push: { vehicles: user._id } }
    );
  }

  res.status(200).json({ success: true, message: "User registered" });
};

// login user

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await liveDatabase.findOne({
    email,
  });
  if (!user) {
    let error = new Error();
    //error.status = 400;
    error.cause = "email";
    error.message = "User not found";
    throw error;
  }

  const isMatch = await VerifyPassword(user.password, password);
  if (!isMatch) {
    let error = new Error();
    //error.status = 400;
    error.cause = "password";
    error.message = "Invalid Password";
    throw error;
  }

  if (!user.vehicles) {
    user = await getCollection(
      process?.env?.["USER_COLLECTION"] || ""
    ).findOneAndUpdate(
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

  /*  res.cookie("refreshId", refreshToken(user), {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  }); */

  res.status(200).json({
    success: true,
    message: "User logged in Successfully",
    data: {
      username: user.username,
      email: user.email,
      id: user._id,
      vehicles: user.vehicles || [],
    },
  });
});

// forgot password

const forgotPassword = async (req: Request, res: Response) => {
  const { email, newPassword, otp } = req.body;
  const verify = await verifyForgotPasswordOtp({ email, otp });

  if (!verify) {
    let error = new Error();
    //error.status = 400;
    error.cause = "otp";
    error.message = "Invalid OTP";
    throw error;
  }

  const hashedPassword = await hashPassword(newPassword);
  await liveDatabase.updateOne(
    { email },
    { $set: { password: hashedPassword } }
  );
  res.status(200).json({ success: true, message: "Password changed" });
};

export { registerUser, loginUser, forgotPassword };
