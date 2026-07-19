import { HttpStatus } from './apiError.js';

export function successResponse(res, data, message = 'Success', statusCode = HttpStatus.OK) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

export function paginatedResponse(res, data, pagination, message = 'Success') {
  return res.status(HttpStatus.OK).json({
    success: true,
    message,
    data,
    pagination,
  });
}

export function errorResponse(res, message, statusCode = HttpStatus.BAD_REQUEST, errors = null) {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
}
