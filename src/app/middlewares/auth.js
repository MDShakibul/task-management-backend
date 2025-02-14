import ApiError from '../../errors/ApiError.js';
import httpStatus from 'http-status';
import { jwtHelpers } from '../../helpers/jwtHelpers.js';
import config from '../../config/index.js';

const auth = (...requiredRoles) => {
  return async (req, res, next) => {
    try {

      // Get authorization token
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized');
      }

      // Verify token
      let verifiedUser = null;
      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret);

      req.user = verifiedUser; // role, userId

      // Guard with role
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
