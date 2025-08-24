import { beforeAll, jest, it, expect } from "@jest/globals";
import { AuthService } from "../src/auth.service";

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { describe } from "node:test";
import { v4 as uuidv4 } from "uuid";
import {
  resetAllMocks,
  testJwtPayload,
  testUser,
  testRefreshToken,
} from "./setup";
import { fail } from "assert";
import { ServiceError } from "../../../shared/types";

const mockedUuidv4 = uuidv4 as unknown as jest.Mock<() => string>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

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

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(() => {
    resetAllMocks();
    authService = new AuthService();
    mockedUuidv4.mockReturnValue("test-uuid-1234");

    (mockedBcrypt.hash as jest.Mock<any>).mockResolvedValue("hashed-password");
    (mockedBcrypt.compare as jest.Mock<any>).mockResolvedValue(true);
    (mockedJwt.sign as jest.Mock).mockReturnValue("test-jwt-token");
    (mockedJwt.verify as jest.Mock).mockReturnValue(testJwtPayload);
  });

  describe("constructor", () => {
    it("should initialize with environment variables", () => {
      expect(authService).toBeInstanceOf(AuthService);
    });

    it("should throw an error if JWT_SECRET is not configured", () => {
      delete process.env.JWT_SECRET;
      expect(() => new AuthService()).toThrow(
        "JWT secrets are not defined in environment variables"
      );
      process.env.JWT_SECRET = "test-jwt-secret-key-for-testing-only";
    });

    it("should throw an error if JWT_REFRESH_SECRET is not configured", () => {
      delete process.env.JWT_REFRESH_SECRET;
      expect(() => new AuthService()).toThrow(
        "JWT secrets are not defined in environment variables"
      );
      process.env.JWT_REFRESH_SECRET =
        "test-jwt-refresh-secret-key-for-testing-only";
    });
  });

  describe("register", () => {
    const email = "test@example.com";
    const password = "test-password";

    it("should register a new user", async () => {
      (global.mockPrisma.user.findUnique as jest.Mock<any>).mockResolvedValue(
        null
      );
      (global.mockPrisma.user.create as jest.Mock<any>).mockResolvedValue(
        testUser
      );
      (
        global.mockPrisma.refreshToken.create as jest.Mock<any>
      ).mockResolvedValue(testRefreshToken);

      const result = await authService.register(email, password);

      expect(global.mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith(password, 4);
      expect(global.mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email,
          password: "hashed-password",
        },
      });

      expect(result).toEqual({
        accessToken: "test-jwt-token",
        refreshToken: "test-jwt-token",
      });
    });

    it("should throw an error if user already exists", async () => {
      const email = "test@example.com";
      const password = "test-password";
      (global.mockPrisma.user.findUnique as jest.Mock<any>).mockResolvedValue(
        testUser
      );

      await expectServiceError(
        async () => authService.register(email, password),
        "User already exists",
        409
      );

      expect(global.mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it("Should handle database errors during creation", async () => {
      const email = "test@example.com";
      const password = "test-password";
      (global.mockPrisma.user.findUnique as jest.Mock<any>).mockResolvedValue(
        null
      );
      (global.mockPrisma.user.create as jest.Mock<any>).mockRejectedValue(
        new Error("DB Error")
      );

      await expect(authService.register(email, password)).rejects.toThrow(
        "DB Error"
      );
    });
  });
});
