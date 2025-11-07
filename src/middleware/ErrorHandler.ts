class databaseError extends Error {
  constructor(message = "Database not Connected") {
    super(message);
    this.message = "Database Error";
    this.status = 500;
    Error.captureStackTrace(this, this.constructor);
    // this capture the actually where error is thrown , this -> current object, this.constructor -> to avoid current constructor
  }
}

class validationError extends Error {
  constructor(message = "Validation Error") {
    super(message);
    this.message = "Validation Error";
    this.status = 400;
    Error.captureStackTrace(this, this.constructor);
  }
}

class unauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.message = "Unauthorized Error";
    this.status = 401;
    Error.captureStackTrace(this, this.constructor);
  }
}

class notFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.message = "Not Found Error";
    this.status = 404;
    Error.captureStackTrace(this, this.constructor);
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const globalErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    cause: err.cause || null,
    message: err.message,
  });
};

export {
  databaseError,
  notFoundError,
  validationError,
  unauthorizedError,
  asyncHandler,
  globalErrorHandler,
};
