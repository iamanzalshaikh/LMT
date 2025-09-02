import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./route/authRoute.js";
import userRouter from "./route/userRoute.js"; 
import courseRouter from "./route/courseRoute.js";
import paymentRouter from "./route/paymentRoute.js";
import reviewRoutes from "./route/reviewRoute.js"; 
dotenv.config();
connectDB();
const app = express();

// Correct CORS middleware with origin and credentials
app.use(cors({
  origin: 'https://lmt-frontend1.netlify.app', // REMOVE the trailing slash
  credentials: true,
}));


// Middleware 
app.use(express.json());
app.use(cookieParser());      

// Routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter); 
app.use("/api/course" , courseRouter)
app.use("/api/order" , paymentRouter)
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.send("LMT Backend API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
