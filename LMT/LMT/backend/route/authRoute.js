import express from "express";
import { signup, login, logout, sendOTP, verifyOTP, resetPassword, googleLogin } from "../controller/authController.js"; 

const authRouter = express.Router();

// Auth routes
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/logout", logout);

// OTP routes
authRouter.post("/sendotp", sendOTP);
authRouter.post("/verifyotp", verifyOTP);
authRouter.post("/resetpassword", resetPassword);


//google login
authRouter.post("/googlelogin" , googleLogin)   

export default authRouter;
