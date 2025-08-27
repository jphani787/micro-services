import Joi from "joi";

export const createNoteSchema = Joi.object({
  title: Joi.string().min(1).max(200).required().messages({
    "string.base": "Title must be a string.",
    "string.min": "Title must be at least 1 character long.",
    "string.max": "Title must be at most 200 characters long.",
    "any.required": "Title is required.",
  }),
  content: Joi.string().min(1).max(50000).required().messages({
    "string.base": "Content must be a string.",
    "string.min": "Content must be at least 1 character long.",
    "string.max": "Content must be at most 50000 characters long.",
    "any.required": "Content is required.",
  }),
  tagIds: Joi.array().items(Joi.string().uuid()).optional().messages({
    "array.base": "Tag IDs must be an array.",
    "string.uuid": "Each tag must be valid UUID.",
  }),
});

export const updateNoteSchema = Joi.object({
  title: Joi.string().min(1).max(200).optional().messages({
    "string.base": "Title must be a string.",
    "string.min": "Title must be at least 1 character long.",
    "string.max": "Title must be at most 200 characters long.",
  }),
  content: Joi.string().min(1).max(50000).optional().messages({
    "string.min": "Content must be at least 1 character long.",
    "string.max": "Content must be at most 50000 characters long.",
  }),
  tagIds: Joi.array().items(Joi.string().uuid()).optional().messages({
    "array.base": "Tag IDs must be an array.",
    "string.uuid": "Each tag must be valid UUID.",
  }),
});

export const getNotesByUserSchema = Joi.object({
  page: Joi.number().integer().min(1).optional().default(1).messages({
    "number.base": "Page must be a number.",
    "number.integer": "Page must be an integer.",
    "number.min": "Page must be at least 1.",
  }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .default(10)
    .messages({
      "number.base": "Limit must be a number.",
      "number.integer": "Limit must be an integer.",
      "number.min": "Limit must be at least 1.",
      "number.max": "Limit must be at most 100.",
    }),
  search: Joi.string().max(200).optional().messages({
    "string.base": "Search must be a string.",
    "string.max": "Search query must not exceed 200 characters.",
  }),
});
