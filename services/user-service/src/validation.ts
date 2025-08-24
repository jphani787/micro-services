import Joi from "joi";

export const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional().messages({
    "string.base": "First name must be a string.",
    "string.min": "First name must be at least 1 character long.",
    "string.max": "First name must be at most 50 characters long.",
  }),
  lastName: Joi.string().min(1).max(50).optional().messages({
    "string.base": "Last name must be a string.",
    "string.min": "Last name must be at least 1 character long.",
    "string.max": "Last name must be at most 50 characters long.",
  }),
  bio: Joi.string().max(500).optional().allow("").messages({
    "string.base": "Bio must be a string.",
    "string.max": "Bio must be at most 500 characters long.",
  }),
  avatarUrl: Joi.string().uri().optional().allow("").messages({
    "string.base": "Avatar URL must be a string.",
    "string.uri": "Avatar URL must be a valid URI.",
  }),
  preferences: Joi.object().optional().messages({
    "object.base": "Preferences must be an valid object.",
  }),
});

export const createProfileSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional().messages({
    "string.base": "First name must be a string.",
    "string.min": "First name must be at least 1 character long.",
    "string.max": "First name must be at most 50 characters long.",
  }),
  lastName: Joi.string().min(1).max(50).optional().messages({
    "string.base": "Last name must be a string.",
    "string.min": "Last name must be at least 1 character long.",
    "string.max": "Last name must be at most 50 characters long.",
  }),
  bio: Joi.string().max(500).optional().allow("").messages({
    "string.base": "Bio must be a string.",
    "string.max": "Bio must be at most 500 characters long.",
  }),
  avatarUrl: Joi.string().uri().optional().allow("").messages({
    "string.base": "Avatar URL must be a string.",
    "string.uri": "Avatar URL must be a valid URI.",
  }),
  preferences: Joi.object().optional().messages({
    "object.base": "Preferences must be an valid object.",
  }),
});
