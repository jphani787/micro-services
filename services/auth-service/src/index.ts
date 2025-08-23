import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import authRoutes from "./routes";
import { errorHandler } from "../../../shared/middleware";

dotenv.config();

console.log("process.env.PORT - ", process.env.NODE_ENV);
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Auth service running a port ${PORT}`);
  console.log(`Enviroment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;
