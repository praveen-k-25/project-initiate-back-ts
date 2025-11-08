import express from "express";
import { Validation } from "../middleware/ValidationHandler.js";
import {
  loginSchema,
  otpSchema,
  registerSchema,
  verifyForgotPasswordOtpSchema,
} from "../utils/authValidationSchema.js";
import {
  forgotPassword,
  loginUser,
  registerUser,
} from "../controller/userController.js";
import {
  forgotPasswordOtp,
  sendRegisterOtp,
} from "../controller/mailController.js";

export const userRouter = express.Router();

userRouter.post("/login", Validation(loginSchema), loginUser);
userRouter.post("/registerOtp", Validation(otpSchema), sendRegisterOtp);
userRouter.post("/register", Validation(registerSchema), registerUser);
userRouter.post("/forgotPasswordOtp", Validation(otpSchema), forgotPasswordOtp);
userRouter.post(
  "/forgotPassword",
  Validation(verifyForgotPasswordOtpSchema),
  forgotPassword
);
