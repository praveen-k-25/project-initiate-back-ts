import express from "express";

const {
  registerUser,
  loginUser,
  forgotPassword,
} = require("../controller/userController");

const Validation = require("../middleware/ValidationHandler");
const {
  registerSchema,
  loginSchema,
  verifyRegisterOtpSchema,
  otpSchema,
  verifyForgotPasswordOtpSchema,
} = require("../utils/authValidationSchema");
const {
  sendRegisterOtp,
  forgotPasswordOtp,
} = require("../controller/mailController");
const userRouter = express.Router();

userRouter.post("/login", Validation(loginSchema), loginUser);
userRouter.post("/registerOtp", Validation(otpSchema), sendRegisterOtp);
userRouter.post("/register", Validation(registerSchema), registerUser);
userRouter.post("/forgotPasswordOtp", Validation(otpSchema), forgotPasswordOtp);
userRouter.post(
  "/forgotPassword",
  Validation(verifyForgotPasswordOtpSchema),
  forgotPassword
);

module.exports = userRouter;
