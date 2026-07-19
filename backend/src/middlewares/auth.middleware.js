import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError, HttpStatus } from '../utils/apiError.js';

export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(HttpStatus.UNAUTHORIZED, 'Access token is required'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch {
    next(new ApiError(HttpStatus.UNAUTHORIZED, 'Invalid or expired access token'));
  }
}

export function authorize(...permissions) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new ApiError(HttpStatus.UNAUTHORIZED, 'Authentication required'));
    }

    if (permissions.length === 0) {
      return next();
    }

    const userPermissions = req.user.permissions || [];
    const hasPermission = permissions.some((p) => userPermissions.includes(p));

    if (!hasPermission) {
      return next(new ApiError(HttpStatus.FORBIDDEN, 'Insufficient permissions'));
    }

    next();
  };
}
