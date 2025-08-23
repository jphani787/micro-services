import { AuthService } from "./auth.service";
import { asyncHandler } from "../../../shared/middleware";
import {
  createSuccessResponse,
  createErrorResponse,
} from "../../../shared/utils";

import { Request, Response, NextFunction } from "express";

const authService = new AuthService();

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.register(email, password);
  res
    .status(201)
    .json(createSuccessResponse(tokens, "User registered successfully"));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.login(email, password);
  res
    .status(200)
    .json(createSuccessResponse(tokens, "User logged in successfully"));
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const token = await authService.refreshToken(refreshToken);
    res
      .status(200)
      .json(createSuccessResponse(token, "Token refreshed successfully"));
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  res
    .status(204)
    .json(createSuccessResponse(null, "User logged out successfully"));
});

export const validateToken = asyncHandler(
  async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json(createErrorResponse("No token provied"));
      return;
    }
    const payload = await authService.validateToken(token);
    res.status(200).json(createSuccessResponse(payload, "Token is valid"));
  }
);

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json(createErrorResponse("User not authenticated"));
    return;
  }

  const user = await authService.getUserById(userId);
  if (!user) {
    res.status(404).json(createErrorResponse("User not found"));
    return;
  }

  res
    .status(200)
    .json(createSuccessResponse(user, "User profile retrieved successfully"));
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json(createErrorResponse("User not authenticated"));
    return;
  }

  await authService.deleteUser(userId);
  res
    .status(204)
    .json(createSuccessResponse(null, "User deleted successfully"));
});
