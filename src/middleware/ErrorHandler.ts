import type { Request, Response, NextFunction } from "express";

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const globalErrorHandler = (err: any, res: Response) => {
  res.status(err.status || 500).json({
    success: false,
    cause: err.cause || null,
    message: err.message,
  });
};

export { asyncHandler, globalErrorHandler };
