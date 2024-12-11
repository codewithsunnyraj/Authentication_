import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./Config/mongodb.js";
import authRouter from "./Routes/authRoute.js";
import userRouter from "./Routes/userRoutes.js";
const app = express();
const port = process.env.PORT || 4000;
connectDB();
const allowedOrigins = ['http://localhost:5173']
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin:allowedOrigins,  credentials: true })); // to work on frontend as well as backend

// API Endpoints

app.get("/", (req, res) => {
  res.send("sunny");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`Running On ${port}`);
});
