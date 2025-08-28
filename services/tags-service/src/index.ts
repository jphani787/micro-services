import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import tagsRoutes from "./routes";
import {
  errorHandler,
  corsOptions,
  healthCheck,
} from "../../../shared/middleware";

dotenv.config();

console.log("process.env.PORT - ", process.env.PORT);
const app = express();
const PORT = process.env.PORT || 3004;
app.use(cors(corsOptions()));
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/tags", tagsRoutes);
app.use("/health", healthCheck);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`User service running a port ${PORT}`);
  console.log(`Enviroment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
