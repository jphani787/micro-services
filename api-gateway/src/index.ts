import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { gatewayAuth } from "./middleware/auth";
import proxyRoutes from "./routes/proxy";
import { createErrorResponse } from "../../shared/utils";

dotenv.config();

console.log("process.env.PORT - ", process.env.PORT);
const app = express();
const PORT = process.env.PORT || 8080;

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: process.env.CORS_CREDENTIALS === "true",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-user-id",
      "x-user-email",
    ],
  })
);
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(gatewayAuth);
app.use(proxyRoutes);

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", err);
    if (!res.headersSent) {
      res
        .status(err.statusCode || 500)
        .json(createErrorResponse(err.message || "Internal Server Error"));
    }
  }
);

const server = app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Gateway URL: http://localhost:${PORT}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log("");
  console.log("📋 Available endpoints:");
  console.log(`   Auth Service:  http://localhost:${PORT}/api/auth/*`);
  console.log(`   User Service:  http://localhost:${PORT}/api/users/*`);
  console.log(`   Notes Service: http://localhost:${PORT}/api/notes/*`);
  console.log(`   Tags Service:  http://localhost:${PORT}/api/tags/*`);
  console.log("");
});

app.on("SIGINT", () => {
  console.log("🛑 API Gateway shutting down...");
  server.close(() => {
    console.log("✅ API Gateway shut down gracefully.");
    process.exit(0);
  });
});

app.on("SIGTERM", () => {
  console.log("🛑 API Gateway shutting down...");
  server.close(() => {
    console.log("✅ API Gateway shut down gracefully.");
    process.exit(0);
  });
});

export default app;
