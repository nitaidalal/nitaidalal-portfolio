import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { generalLimiter } from "./middleware/rateLimiter.js";

import router from "./routes/index.js";

connectDB();
connectCloudinary();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }),
);

app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(generalLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running 🚀",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", router);

app.use(notFound);
app.use(errorHandler);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
