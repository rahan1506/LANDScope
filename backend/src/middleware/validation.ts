import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { sendError } from "../utils/response";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return sendError(
          res,
          "Validation failed",
          422,
          err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")
        );
      }
      return sendError(res, "Invalid request payload", 400);
    }
  };
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return sendError(
          res,
          "Invalid query parameters",
          422,
          err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ")
        );
      }
      return sendError(res, "Invalid query parameters", 400);
    }
  };
}
