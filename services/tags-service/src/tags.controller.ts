import { Request, Response } from "express";
import { asyncHandler } from "../../../shared/middleware";
import { TagsService } from "./tags.service";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../../../shared/utils";
const tagsService = new TagsService();

export const createTags = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json(createErrorResponse("Unauthorized"));
    return;
  }

  const tag = await tagsService.createTag(userId, req.body);

  res.status(201).json(createSuccessResponse(tag, "Tag created successfully"));
  return;
});

export const getTags = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(401).json(createErrorResponse("Unauthorized"));
    return;
  }

  const page = parseInt(req.query.page as string) || 1;
  const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
  const search = req.query.search as string;

  const result = await tagsService.getTagsByUser(page, limit, search, userId);

  res.status(200).json(
    createSuccessResponse(
      {
        tags: result.tags,
        pagination: {
          page: result.page,
          limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      },
      "Tags retrieved successfully"
    )
  );
  return;
});

export const getTagById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const tagId = req.params.id;
  if (!userId) {
    res.status(401).json(createErrorResponse("Unauthorized"));
    return;
  }

  const tag = await tagsService.getTagById(tagId, userId);
  if (!tag) {
    res.status(404).json(createErrorResponse("Tag not found"));
    return;
  }

  res
    .status(200)
    .json(createSuccessResponse(tag, "Tag retrieved successfully"));
  return;
});

export const validateTags = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json(createErrorResponse("Unauthorized"));
      return;
    }

    const { tagIds } = req.body;
    const result = await tagsService.validateTags(tagIds, userId);

    res
      .status(200)
      .json(createSuccessResponse(result, "Tags validation result"));
    return;
  }
);
