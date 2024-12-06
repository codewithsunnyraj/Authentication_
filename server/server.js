import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./Config/mongodb.js";
import authRouter from "./Routes/authRoute.js";
const app = express();
const port = process.env.PORT || 4000;
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true }));

// API Endpoints

app.get("/", (req, res) => {
  res.send("sunny");
});

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Running On ${port}`);
});
