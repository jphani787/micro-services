import { beforeAll, jest, it, expect } from "@jest/globals";
import { AuthService } from "../src/auth.service";
import { resetAllMocks } from "./setup";

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

describe("AuthService", () => {
  let authService: AuthService;

  beforeAll(() => {
    resetAllMocks();
    authService = new AuthService();
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
  });
});
