import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// Morgan-like request logging middleware
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Override res.end to capture response time and status
  const originalEnd = res.end;
  res.end = function (chunk?: any, encoding?: any, cb?: () => void) {
    const duration = Date.now() - start;
    const contentLength = res.get("content-length") || 0;

    logger.http(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${contentLength} - ${duration}ms`
    );

    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

// Error logging middleware
export const errorLogger = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`Error in ${req.method} ${req.originalUrl}:`, {
    error: error.message,
    stack: error.stack,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  next(error);
};
