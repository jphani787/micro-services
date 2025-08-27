import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  validateToken,
  getProfile,
  deleteUser,
} from "./auth.controller";
import { authenticateToken, validateRequest } from "../../../shared/middleware";
import { registerSchema, loginSchema, refreshTokenSchema } from "./validation";

const router = Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh", validateRequest(refreshTokenSchema), refreshToken);
router.post("/logout", validateRequest(refreshTokenSchema), logout);

router.post("/validate", validateToken);
router.get("/profile", authenticateToken, getProfile);
router.delete("/profile", authenticateToken, deleteUser);

export default router;
