const handelValidationError = (error) => {
    const errors = Object.keys(error).map((key) => {
      return {
        path: key,
        message: error[key]?.message || 'Invalid value',
      };
    });
  
    const statusCode = 400;
    return {
      statusCode,
      message: 'Validation Error',
      errorMessages: errors,
    };
  };
  
  export default handelValidationError;
  