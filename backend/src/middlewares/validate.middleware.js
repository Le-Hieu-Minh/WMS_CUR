import { ApiError, HttpStatus } from '../utils/apiError.js';

export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return next(new ApiError(HttpStatus.BAD_REQUEST, 'Validation failed', errors));
    }

    const { body, query, params } = result.data;
    if (body) req.body = body;
    if (query) req.query = query;
    if (params) req.params = params;

    next();
  };
}
