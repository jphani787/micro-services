import { UserProfile } from "@prisma/client";
import { UpdateUserProfile } from "../../../shared/types";
import { AuthClient } from "./auth.client";
import prisma from "./database";
import { createServiceError, sanitizeInput } from "../../../shared/utils";

export class UserService {
  private authClient: AuthClient;

  constructor() {
    this.authClient = new AuthClient();
  }

  async createProfile(
    userId: string,
    profileData: Partial<UpdateUserProfile>
  ): Promise<UserProfile> {
    const existProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (existProfile) {
      throw createServiceError("User profile already exists", 409);
    }

    const sanitizedData = this.sanitizeProfileData(profileData);
    const profile = await prisma.userProfile.create({
      data: {
        userId,
        ...sanitizedData,
      },
    });

    return profile;
  }

  async updateProfile(
    userId: string,
    profileData: Partial<UpdateUserProfile>
  ): Promise<UserProfile> {
    const existingProfile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return this.createProfile(userId, profileData);
    }

    const sanitizedData = this.sanitizeProfileData(profileData);

    const updatedProfile = await prisma.userProfile.update({
      where: { userId },
      data: {
        ...sanitizedData,
      },
    });

    return updatedProfile;
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw createServiceError("User profile not found", 404);
    }

    await prisma.userProfile.delete({
      where: { userId },
    });
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw createServiceError("User profile not found", 404);
    }

    return profile;
  }

  private sanitizeProfileData(
    data: Partial<UpdateUserProfile>
  ): Partial<UpdateUserProfile> {
    const sanitized: any = {};
    if (data.firstName !== undefined) {
      sanitized.firstName = data.firstName
        ? sanitizeInput(data.firstName)
        : null;
    }

    if (data.lastName !== undefined) {
      sanitized.lastName = data.lastName ? sanitizeInput(data.lastName) : null;
    }

    if (data.bio !== undefined) {
      sanitized.bio = data.bio ? sanitizeInput(data.bio) : null;
    }

    if (data.avatarUrl !== undefined) {
      sanitized.avatarUrl = data.avatarUrl
        ? sanitizeInput(data.avatarUrl)
        : null;
    }

    if (data.preferences !== undefined) {
      sanitized.preferences = data.preferences ? data.preferences : null;
    }
    return sanitized;
  }
}
