import type { Request, Response, NextFunction } from "express";

class AppError extends Error {
  status: number;
  cause?: string | null;

  constructor(message: string, status: number, cause?: string | null) {
    super(message);
    this.status = status;
    this.cause = cause || null;
    this.name = "AppError";
  }
}

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {} = req;
  res.status(err.status || 500).json({
    success: false,
    cause: err.cause || null,
    message: err.message,
  });
  next();
};

export { asyncHandler, globalErrorHandler, AppError };
