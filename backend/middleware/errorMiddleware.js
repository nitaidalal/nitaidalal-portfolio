// ─────────────────────────────────────────────────────
// 404 Route Handler
// ─────────────────────────────────────────────────────
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);

  res.status(404);

  next(error);
};

// ─────────────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────────────
export const errorHandler = (err, req, res, next) => {
  // If status code still 200, make it 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;

  // ─── Invalid MongoDB ObjectId ─────────────────────
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
  }

  // ─── Duplicate Key Error ──────────────────────────
  if (err.code === 11000) {
    statusCode = 400;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;
  }

  // ─── Mongoose Validation Error ────────────────────
  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // ─── JWT Invalid Token ────────────────────────────
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // ─── JWT Expired Token ────────────────────────────
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired, please login again";
  }

  // ─── Send Final Response ──────────────────────────
  res.status(statusCode).json({
    success: false,
    message,

    // Stack trace only in development mode
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};
