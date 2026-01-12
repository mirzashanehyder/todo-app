import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userRoute } from "./APIs/userAPI.js";
import { verifyToken } from "./middleware/verifyToken.js";
import { UserModel } from "./models/userModel.js";

const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "https://todo-app-seven-sandy.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie"
    ],
  })
);

// 🔥 VERY IMPORTANT (handles preflight fully)
app.options("*", cors());


app.use(express.json());
app.use(cookieParser());


app.use("/user-api", userRoute);

async function connectDBAndStartServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(" MongoDB connected");

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(" DB connection error:", err.message);
    process.exit(1);
  }
}

connectDBAndStartServer();

app.get("/refresh", verifyToken, async (req, res) => {
  try {
    const userObj = await UserModel.findOne({ email: req.user.email });
    res.status(200).json({ message: "user", payload: userObj });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});



