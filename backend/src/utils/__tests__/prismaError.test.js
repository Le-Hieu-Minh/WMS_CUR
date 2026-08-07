import { Prisma } from '@prisma/client';
import { mapPrismaError } from '../prismaError.js';

function makePrismaError(code, meta = {}) {
  return new Prisma.PrismaClientKnownRequestError('Simulated', {
    code,
    clientVersion: '6.5.0',
    meta,
  });
}

describe('mapPrismaError', () => {
  it('returns null for non-Prisma errors', () => {
    expect(mapPrismaError(new Error('generic'))).toBeNull();
  });

  it('maps P2002 to conflict', () => {
    const mapped = mapPrismaError(makePrismaError('P2002', { target: ['email'] }));
    expect(mapped).toEqual({
      statusCode: 409,
      message: 'Giá trị email đã tồn tại',
    });
  });

  it('maps P2003 to bad request', () => {
    const mapped = mapPrismaError(makePrismaError('P2003'));
    expect(mapped).toEqual({
      statusCode: 400,
      message: 'Tham chiếu không hợp lệ',
    });
  });

  it('maps P2025 to not found', () => {
    const mapped = mapPrismaError(makePrismaError('P2025'));
    expect(mapped).toEqual({
      statusCode: 404,
      message: 'Không tìm thấy bản ghi',
    });
  });
});
