/* const sendResponse = (res, data) => {
    const responseData = {
      statusCode: data.statusCode,
      success: data.success,
      message: data.message || null,
      meta: data.meta || null,
      data: data.data || null,
    };
    res.status(data.statusCode).json(responseData);
  };
  
  export default sendResponse;
   */

  const sendResponse = (res, { statusCode, success, message = null, data = null, meta }) => {
    const responseData = {
      statusCode,
      success,
      message,
      data,
      ...(meta && { meta }) // Only add `meta` if it exists
    };
  
    res.status(statusCode).json(responseData);
  };
  
  export default sendResponse;
  