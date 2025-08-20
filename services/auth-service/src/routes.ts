import { Router } from "express";
import { register, login } from "./auth.controller";
import { validateSchema } from "@shared/middleware/index";
import { registerSchema, loginSchema } from "@/validation";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);

export default router;
