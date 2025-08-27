import {
  createErrorResponse,
  createServiceError,
  sanitizeInput,
} from "../../../shared/utils";
import { CreateNoteRrequest, Note } from "../../../shared/types";
import prisma from "./database";

export class NoteService {
  constructor() {}

  async createNote(
    userId: string,
    noteData: CreateNoteRrequest,
    authToken?: string
  ): Promise<Note> {
    const sanitizedTitle = sanitizeInput(noteData.title);
    const sanitizedContent = sanitizeInput(noteData.content);

    const notes = await prisma.note.create({
      data: {
        userId,
        title: sanitizedTitle,
        content: sanitizedContent,
      },
      include: { noteTags: true },
    });

    return notes as Note;
  }

  async getNoteById(userId: string, noteId: string): Promise<Note> {
    const note = await prisma.note.findFirst({
      where: { id: noteId, userId, isDeleted: false },
      include: { noteTags: true },
    });

    if (!note) {
      throw createServiceError("Note not found", 404);
    }
    return note as Note;
  }
}
