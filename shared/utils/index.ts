import { ApiResponse, ServiceError } from "../types";

export function createApiResponse<T>(
  success: boolean,
  data?: T,
  message?: string,
  error?: string
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    error,
  };
}

export function createSuccessResponce<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  return createApiResponse(true, data, message);
}

export function createErrorResponce(error: string): ApiResponse {
  return createApiResponse(false, undefined, undefined, error);
}

export function createServiceError(
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): ServiceError {
  return new ServiceError(message, statusCode, code, details);
}
