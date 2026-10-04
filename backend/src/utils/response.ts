import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    timestamp: string;
    isDemo?: boolean;
    durationMs?: number;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  meta?: Partial<ApiResponse["meta"]>
) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta,
    },
  });
}

export function sendError(
  res: Response,
  error: string,
  statusCode: number = 400,
  message?: string
) {
  return res.status(statusCode).json({
    success: false,
    error,
    message,
    meta: {
      timestamp: new Date().toISOString(),
    },
  });
}
