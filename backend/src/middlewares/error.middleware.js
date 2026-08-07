import { ApiError, HttpStatus } from '../utils/apiError.js';
import { mapPrismaError } from '../utils/prismaError.js';

export function errorMiddleware(err, req, res, _next) {
  const prismaError = mapPrismaError(err);
  const statusCode = prismaError?.statusCode || err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
  const message = prismaError?.message || err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || null,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
}

export function notFoundMiddleware(req, _res, next) {
  next(new ApiError(HttpStatus.NOT_FOUND, `Route ${req.originalUrl} not found`));
}
