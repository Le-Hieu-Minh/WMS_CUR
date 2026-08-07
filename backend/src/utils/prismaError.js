import { Prisma } from '@prisma/client';
import { HttpStatus } from './apiError.js';

function formatUniqueViolationMessage(meta) {
  const target = meta?.target;
  if (Array.isArray(target) && target.length > 0) {
    return `Giá trị ${target.join(', ')} đã tồn tại`;
  }
  return 'Dữ liệu đã tồn tại';
}

export function mapPrismaError(err) {
  if (!(err instanceof Prisma.PrismaClientKnownRequestError)) {
    return null;
  }

  switch (err.code) {
    case 'P2002':
      return {
        statusCode: HttpStatus.CONFLICT,
        message: formatUniqueViolationMessage(err.meta),
      };
    case 'P2003':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Tham chiếu không hợp lệ',
      };
    case 'P2025':
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Không tìm thấy bản ghi',
      };
    case 'P2014':
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Vi phạm ràng buộc dữ liệu',
      };
    default:
      return null;
  }
}
