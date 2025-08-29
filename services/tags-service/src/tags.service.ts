import {
  createServiceError,
  sanitizeInput,
  isValidUUID,
} from "../../../shared/utils";
import { CreateTagRequest, Tag } from "../../../shared/types";
import prisma from "./database";

export class TagsService {
  constructor() {}

  async createTag(userId: string, tagData: CreateTagRequest): Promise<Tag> {
    const sanitizedName = sanitizeInput(tagData.name);
    const sanitizedColor = tagData.color
      ? sanitizeInput(tagData.color)
      : undefined;

    if (sanitizedColor && !this.isValidHexColor(sanitizedColor)) {
      throw createServiceError(
        "Invalid color format, Use hex color format (e.g. #ff5733 or #f73)",
        400
      );
    }

    try {
      const tag = await prisma.tag.create({
        data: {
          userId,
          name: sanitizedName,
          color: sanitizedColor,
        },
      });
      return tag as Tag;
    } catch (error) {
      if (error.code === "P2002") {
        throw createServiceError("Tag with this name already exists", 409);
      }
      throw createServiceError("Failed to create tag", 500);
    }
  }

  async getTagById(tagId: string, userId: string): Promise<Tag> {
    if (!isValidUUID(tagId)) {
      throw createServiceError("Invalid tag ID", 400);
    }

    const tag = await prisma.tag.findFirst({
      where: {
        id: tagId,
        userId,
      },
    });

    if (!tag) {
      throw createServiceError("Tag not found", 404);
    }

    return tag as Tag;
  }

  async getTagsByUser(
    page: number = 1,
    limit: number = 50,
    search?: string,
    userId?: string
  ): Promise<{
    tags: Tag[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;
    const whereClause: any = {
      userId,
    };
    if (search) {
      const searchSanitized = sanitizeInput(search);
      whereClause.name = {
        contains: searchSanitized,
        mode: "insensitive",
      };
    }

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.tag.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      tags: tags as Tag[],
      total,
      page,
      totalPages,
    };
  }

  async validateTags(
    tagIds: string[],
    userId: string
  ): Promise<{
    validTags: Tag[];
    invalidTags: string[];
  }> {
    const validTags: Tag[] = [];
    const invalidTagIds: string[] = [];
    for (const tagId of tagIds) {
      if (!isValidUUID(tagId)) {
        invalidTagIds.push(tagId);
        continue;
      }
      try {
        const tag = await this.getTagById(tagId, userId);
        validTags.push(tag);
      } catch (error) {
        invalidTagIds.push(tagId);
      }
    }
    return {
      validTags,
      invalidTags: invalidTagIds,
    };
  }

  private isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }
}
