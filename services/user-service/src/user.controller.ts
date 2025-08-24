import { asyncHandler } from "../../../shared/middleware";
import { Request, Response } from "express";
import { UserService } from "./user.service";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils";

const userService = new UserService();

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json(createErrorResponse("User not authenticated"));
    return;
  }

  const profile = await userService.getProfile(userId);
  if (!profile) {
    res.status(404).json(createErrorResponse("Profile not found"));
    return;
  }
  res
    .status(200)
    .json(
      createSuccessResponse(profile, "User profile retrieved successfully")
    );
});

export const updateProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(createErrorResponse("User not authenticated"));
      return;
    }

    const updatedProfile = await userService.updateProfile(userId, req.body);
    if (!updatedProfile) {
      res.status(404).json(createErrorResponse("Profile not found"));
      return;
    }
    res
      .status(200)
      .json(
        createSuccessResponse(
          updatedProfile,
          "User profile updated successfully"
        )
      );
  }
);

export const createProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(createErrorResponse("User not authenticated"));
      return;
    }

    const profile = await userService.createProfile(userId, req.body);
    if (!profile) {
      res.status(400).json(createErrorResponse("Error creating profile"));
      return;
    }
    res
      .status(201)
      .json(
        createSuccessResponse(profile, "User profile created successfully")
      );
  }
);

export const deleteProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json(createErrorResponse("User not authenticated"));
      return;
    }

    await userService.deleteProfile(userId);

    res
      .status(200)
      .json(createSuccessResponse(null, "User profile deleted successfully"));
  }
);
