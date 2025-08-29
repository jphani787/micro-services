import { Router } from "express";
import { createNote, getNoteById, getNotes } from "./note.controller";
import { validateRequest, authenticateToken } from "../../../shared/middleware";
import { createNoteSchema, getNotesByUserSchema } from "./validation";

const router = Router();

router.use(authenticateToken);
router.post("/", validateRequest(createNoteSchema), createNote);
router.get("/", validateRequest(getNotesByUserSchema), getNotes);
router.get("/:noteId", getNoteById);

export default router;
