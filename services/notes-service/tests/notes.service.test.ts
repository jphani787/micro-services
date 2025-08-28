import { ServiceError } from "../../../shared/types";
import { NoteService } from "../src/notes.service";
import { resetAllMocks, testNote } from "./setup";

async function expectServiceError(
  asyncFn: () => Promise<any>,
  expectedMessage: string,
  expectedStatusCode: number
): Promise<void> {
  try {
    await asyncFn();
    fail("Expected function to throw ServiceError");
  } catch (error: any) {
    expect(error).toBeInstanceOf(ServiceError);
    expect(error.message).toBe(expectedMessage);
    expect(error.statusCode).toBe(expectedStatusCode);
  }
}

describe("Notes Service", () => {
  let noteService: NoteService;

  beforeEach(() => {
    resetAllMocks();
    noteService = new NoteService();
  });

  describe("createNote", () => {
    let userId = "test-user-id-123";
    it("should create a note successfully without tags ", async () => {
      global.mockPrisma.note.create.mockResolvedValue(testNote);

      const result = await noteService.createNote(userId, {
        title: "Test Note",
        content: "This is a test note",
      });

      expect(global.mockPrisma.note.create).toHaveBeenCalledWith({
        data: {
          title: "Test Note",
          content: "This is a test note",
          userId,
        },
        include: {
          noteTags: true,
        },
      });
      expect(result).toEqual(testNote);
    });
  });

  describe("getNote", () => {
    let userId = "test-user-id-123";
    let noteId = "test-note-id-123";

    it("should successfully retrieve a note by id", async () => {
      global.mockPrisma.note.findFirst.mockResolvedValue(testNote);

      const result = await noteService.getNoteById(userId, noteId);

      expect(global.mockPrisma.note.findFirst).toHaveBeenCalledWith({
        where: {
          id: noteId,
          userId,
          isDeleted: false,
        },
        include: {
          noteTags: true,
        },
      });
      expect(result).toEqual(testNote);
    });

    it("should throw an error if note is not found", async () => {
      global.mockPrisma.note.findFirst.mockResolvedValue(null);
      await expectServiceError(
        () => noteService.getNoteById(userId, noteId),
        "Note not found",
        404
      );
    });
  });
});
