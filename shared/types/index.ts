export interface User {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  preferences?: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserProfile {
  firstName?: string | null;
  lastName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  preferences?: Record<string, any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ServiceError extends Error {
  statusCode: number;
  code?: string;
  details?: any;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: any
  ) {
    super(message);
    this.name = "ServiceError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function logError(error: Error, context?: Record<string, any>): void {
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    context,
    timeStamp: new Date().toISOString(),
  });
}
