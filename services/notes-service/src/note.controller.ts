import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/middleware";
import { NoteService } from "./notes.service";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils";
const noteService = new NoteService();

export const createNote = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId as string;

    if (!userId) {
      res.status(401).json(createErrorResponse("Unauthorized"));
      return;
    }

    const authHeader = req.headers.authorization;
    const authToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    const note = await noteService.createNote(userId, req.body, authToken);
    res
      .status(201)
      .json(createSuccessResponse(note, "Note created successfully"));
    return;
  }
);

export const getNoteById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId as string;
    const noteId = req.params.id;
    if (!userId) {
      res.status(401).json(createErrorResponse("Unauthorized"));
      return;
    }
    const note = await noteService.getNoteById(userId, noteId);
    res
      .status(200)
      .json(createSuccessResponse(note, "Note retrieved successfully"));
    return;
  }
);
