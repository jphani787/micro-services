// import { jest } from "@jest/globals";

process.env.NODE_ENV = "test";

const mockPrismaClient = {
  note: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  noteTag: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    deleteMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  $disconnect: jest.fn(),
  $connect: jest.fn(),
};

jest.mock("../src/database", () => mockPrismaClient);

global.mockPrisma = mockPrismaClient;

beforeEach(() => {
  jest.clearAllMocks();
});

export const testNote = {
  id: "test-note-id-123",
  userId: "test-user-id-456",
  title: "Test Note title",
  content: "This is a test note.",
  isDeleted: false,
  createdAt: new Date("2025-08-01T00:00:00Z"),
  updatedAt: new Date("2025-08-01T00:00:00Z"),
  noteTags: [],
};

export const testCreateNoteRequest = {
  title: "New Test Note title",
  content: "This is a new test note.",
  tagIds: ["tag-id-1", "tag-id-2"],
};

export const testUpdateNoteRequest = {
  title: "Updated Test Note title",
  content: "This is an updated test note.",
};

export function resetAllMocks() {
  Object.values(mockPrismaClient.note).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });

  Object.values(mockPrismaClient.noteTag).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
}

declare global {
  var mockPrisma: typeof mockPrismaClient;
}
