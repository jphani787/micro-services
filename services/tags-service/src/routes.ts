import { Router } from "express";
import {
  createTags,
  getTagById,
  getTags,
  validateTags,
} from "./tags.controller";
import { authenticateToken } from "../../../shared/middleware";
import { validateRequest } from "../../../shared/middleware";
import {
  createTagSchema,
  getTagsByUserSchema,
  validateTagsSchema,
} from "./validation";

const router = Router();

router.use(authenticateToken);
router.post("/", validateRequest(createTagSchema), createTags);
router.get("/", validateRequest(getTagsByUserSchema), getTags);
router.get("/:id", getTagById);
router.post("/:tagId", validateRequest(validateTagsSchema), validateTags);

export default router;
