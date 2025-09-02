import express from "express"
import isAuth from "../middleware/isAuth.js"
import { getCurrentUser, updateProfile } from "../controller/userController.js"
import upload from "../middleware/multer.js"


let userRouter = express.Router()

userRouter.get("/getCurrentUser", isAuth, getCurrentUser)

userRouter.post("/profile", isAuth, upload.single("photoUrl"), updateProfile);

export default userRouter

