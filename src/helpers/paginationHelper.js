const calculatePagination = (options = {}) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const sortBy = options.sortBy || 'created_at';
    const sortOrder = options.sortOrder || 'desc';
  
    const skip = (page - 1) * limit;
  
    return { page, limit, skip, sortBy, sortOrder };
  };
  
  export const paginationHelpers = {
    calculatePagination,
  };
  