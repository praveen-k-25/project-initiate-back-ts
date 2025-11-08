import type { Request, Response, NextFunction } from "express";
import type { AnySchema, ValidationError } from "yup";

const Validation =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next();
    } catch (err) {
      const error = err as ValidationError;
      res.status(400).json({
        success: false,
        message: error.message,
        errors: error.errors, // array of validation messages
      });
    }
  };

export { Validation };
