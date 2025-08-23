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
import { validateSchema } from "../../../shared/middleware";
import { registerSchema, loginSchema, refreshTokenSchema } from "./validation";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/refresh", validateSchema(refreshTokenSchema), refreshToken);
router.post("/logout", validateSchema(refreshTokenSchema), logout);

router.post("/validate", validateToken);
router.get("/profile", getProfile);
router.delete("/profile", deleteUser);

export default router;
