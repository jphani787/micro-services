import { createServiceError } from "../../../shared/utils";
import axios from "axios";

export interface TagValidationResponse {
  validTags: Array<{
    id: string;
    name: string;
    color?: string;
    userId: string;
    createdAt: Date;
  }>;
  invalidTagIds?: string[];
}

export class TagsServiceClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.TAGS_SERVICE_URL || "http://localhost:3004";
  }

  async validateTags(
    tagsIds: string[],
    authToken: string
  ): Promise<TagValidationResponse> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/tags/validate`,
        { tagsIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          timeout: 5000,
        }
      );

      if (!response.data.success) {
        throw createServiceError("Tag validation failed", 400);
      }

      return response.data.data;
    } catch (error) {
      console.error("Error validating tags:", error);
      if (error.response) {
        const statusCode = error.response?.status || 500;
        const message = error.response?.data?.error || "Tag validation failed";
        throw createServiceError(message, statusCode);
      } else if (error.request) {
        throw createServiceError("Tags service unavailable", 503);
      } else {
        throw createServiceError("An unexpected error occurred", 500);
      }
    }
  }

  async getTagsByIds(
    tags: string[],
    authToken: string
  ): Promise<
    Array<{
      id: string;
      name: string;
      color?: string;
      userId: string;
      createdAt: Date;
    }>
  > {
    const validation = await this.validateTags(tags, authToken);
    if ((validation.invalidTagIds ?? []).length > 0) {
      throw createServiceError("Invalid tag ids", 400);
    }

    return validation.validTags;
  }
}
