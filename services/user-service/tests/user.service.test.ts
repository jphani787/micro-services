import { beforeAll, jest, it, expect } from "@jest/globals";
import { UserService } from "../src/user.service";

jest.mock("../src/auth.client");

import { AuthClient } from "../src/auth.client";
import { ServiceError } from "../../../shared/types";
import { describe } from "node:test";
import { fail } from "assert";
import { testUpdateUserProfile, testUserProfile } from "./setup";

const MockedAuthClient: any = AuthClient as jest.MockedClass<typeof AuthClient>;

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

describe("UserService", () => {
  let userService: UserService;
  let mockAuthClient = jest.mocked<AuthClient>;
  beforeAll(() => {
    jest.clearAllMocks();

    mockAuthClient = {
      validateToken: jest.fn(),
    } as any;

    MockedAuthClient.mockImplementation(() => mockAuthClient);

    userService = new UserService();
  });

  describe("getProfile", async () => {
    const userId = "test-user-id";

    it("should retrieve an existing user profile successfully", async () => {
      (global as any).mockPrisma.userProfile.findUnique.mockResolvedValue(
        testUserProfile
      );

      const result = await userService.getProfile(userId);
      expect(
        (global as any).mockPrisma.userProfile.findUnique
      ).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(result).toEqual(testUserProfile);
    });

    it("should throw an error if user profile does not exists", async () => {
      (global as any).mockPrisma.userProfile.findUnique.mockResolvedValue(null);

      await expectServiceError(
        () => userService.getProfile(userId),
        "User profile not found",
        404
      );
      expect(
        (global as any).mockPrisma.userProfile.findUnique
      ).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });

  describe("createProfile", () => {
    const userId = "test-user-id";
    const profileData = {
      firstName: "Test",
      lastName: "User",
      bio: "This is a test user profile.",
      avatarUrl: "http://localhost:3001/avatars/test-user-id-123",
      preferences: {
        theme: "dark",
        notifications: true,
      },
    };

    it("should create user profile successfully", async () => {
      (global as any).mockPrisma.userProfile.findUnique.mockResolvedValue(null);

      (global as any).mockPrisma.userProfile.create.mockResolvedValue(
        profileData
      );

      const result = await userService.createProfile(userId, profileData);
      expect(
        (global as any).mockPrisma.userProfile.findUnique
      ).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(
        (global as any).mockPrisma.userProfile.create
      ).toHaveBeenCalledWith({
        data: {
          userId,
          ...profileData,
        },
      });

      expect(result).toEqual(profileData);
    });

    it("should throw an error if profile already exists", async () => {
      (global as any).mockPrisma.userProfile.findUnique.mockResolvedValueOnce(
        profileData
      );

      await expectServiceError(
        () => userService.createProfile(userId, profileData),
        "User profile already exists",
        409
      );

      expect(
        (global as any).mockPrisma.userProfile.create
      ).not.toHaveBeenCalled();
    });

    it("should sanitize input data before creating profile", async () => {
      const unauthorizedData = {
        firstName: "<script>Test('123')</script>",
        lastName: "<script>User</script>",
        bio: "<script>This is a test user profile.</script>",
        avatarUrl:
          "<script>http://localhost:3001/avatars/test-user-id-123</script>",
        preferences: {
          theme: "dark",
          notifications: true,
        },
      };

      (global as any).mockPrisma.userProfile.findUnique.mockResolvedValue(null);
      (global as any).mockPrisma.userProfile.create.mockResolvedValue(
        unauthorizedData
      );

      await userService.createProfile(userId, unauthorizedData);
      expect(
        (global as any).mockPrisma.userProfile.create
      ).toHaveBeenCalledWith({
        data: {
          userId,
          ...{
            firstName: "scriptTest('123')/script",
            lastName: "scriptUser/script",
            bio: "scriptThis is a test user profile./script",
            avatarUrl:
              "scripthttp://localhost:3001/avatars/test-user-id-123/script",
            preferences: {
              theme: "dark",
              notifications: true,
            },
          },
        },
      });
    });
  });
  describe("updateProfile", async () => {
    const userId = "test-user-id";

    it("should update exising user profile successfully", async () => {
      (global as any).mockPrisma.userProfile.findUnique.mockResolvedValue(null);
      (global as any).mockPrisma.userProfile.update.mockResolvedValue({
        ...testUserProfile,
        ...testUpdateUserProfile,
      });
    });

    it("should create user profile if does not exist", async () => {
      (global as any).mockPrisma.userProfile.findUnique.mockResolvedValue(null);
      (global as any).mockPrisma.userProfile.create.mockResolvedValue(
        testUserProfile
      );

      const result = await userService.updateProfile(
        userId,
        testUpdateUserProfile
      );
      expect(
        (global as any).mockPrisma.userProfile.findUnique
      ).toHaveBeenCalledWith({
        where: { userId },
      });
      expect(
        (global as any).mockPrisma.userProfile.create
      ).toHaveBeenCalledWith({
        data: {
          userId,
          ...testUpdateUserProfile,
        },
      });
      expect(result).toEqual(testUserProfile);
    });
  });
});
