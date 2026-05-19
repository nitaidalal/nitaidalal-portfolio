import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import connectCloudinary from "./config/cloudinary.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { generalLimiter } from "./middleware/rateLimiter.js";


dotenv.config();

connectDB();
connectCloudinary();

const app = express();

// ─── Security ─────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  }),
);

// ─── Parsers ──────────────────────────────────────────
app.use(express.json({ limit: "10mb" })); //
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());



// ─── Logger ───────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─────────────────────────────────────────
// Rate Limiter
// ─────────────────────────────────────────
app.use(generalLimiter);


// ─── Health Check ─────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Portfolio API is running 🚀",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});


//error handling middleware should be last
app.use(notFound);
app.use(errorHandler);




// ─── Start ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
  );
});
