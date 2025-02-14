class ApiError extends Error {
    constructor(statusCode, message = undefined, stack = '') {
      super(message);
      this.statusCode = statusCode;
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }

  export default ApiError;
  