import axios from "axios";
import { jest, beforeEach } from "@jest/globals";

// Mock environment variables
process.env.JWT_SECRET = "test";
process.env.AUTH_SERVICE_URL = "http://localhost:3001";

const mockPrismaClient = {
  userProfile: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    count: jest.fn(),
  },
  $disconnect: jest.fn(),
  $connect: jest.fn(),
};

jest.mock("../src/database", () => mockPrismaClient);

jest.mock("axios");
const mockAxios = axios as jest.Mocked<typeof axios>;

global.mockPrisma = mockPrismaClient;
global.mockAxios = mockAxios;

beforeEach(() => {
  jest.clearAllMocks();
});

export const testUserProfile = {
  id: "test-uuid-123",
  userId: "test-user-id",
  firstName: "Test",
  lastName: "User",
  bio: "This is a test user profile.",
  avatarUrl: "http://localhost:3001/avatars/test-user-id-123",
  preferences: {
    theme: "dark",
    notifications: true,
  },
  createdAt: new Date("2025-08-01T00:00:00Z"),
  updatedAt: new Date("2025-08-01T00:00:00Z"),
};

export const testUpdateUserProfile = {
  firstName: "update Test",
  lastName: "update",
  bio: "update This is a test user profile.",
  avatarUrl: "http://localhost:3001/avatars/test-user-id-12",
  preferences: {
    theme: "light",
    notifications: false,
  },
};

export const testJwtPayload = {
  userId: testUserProfile.id,
  email: "test@example.com",
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 60 * 15,
};

export function resetAllMocks() {
  Object.values(mockPrismaClient.userProfile).forEach((mock) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });

  mockAxios.post.mockReset();
}

declare global {
  var mockPrisma: typeof mockPrismaClient;
  var mockAxios: jest.Mocked<typeof axios>;
}
