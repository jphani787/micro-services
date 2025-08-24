import { authenticateToken, validateSchema } from "../../../shared/middleware";
import * as userController from "./user.controller";
import { Router } from "express";
import { updateProfileSchema, createProfileSchema } from "./validation";

const router = Router();

router.get("/profile", authenticateToken, userController.getProfile);
router.put(
  "/profile",
  authenticateToken,
  validateSchema(updateProfileSchema),
  userController.updateProfile
);
router.post(
  "/profile",
  authenticateToken,
  validateSchema(createProfileSchema),
  userController.createProfile
);
router.delete("/profile", authenticateToken, userController.deleteProfile);

export default router;
