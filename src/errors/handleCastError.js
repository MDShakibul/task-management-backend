const handleCastError = (error) => {
    const errors = [
      {
        path: error.sqlMessage || 'Unknown field',
        message: 'Invalid Id or data type mismatch',
      },
    ];
  
    const statusCode = 400;
    return {
      statusCode,
      message: 'Cast Error',
      errorMessages: errors,
    };
  };

  export default handleCastError;
  