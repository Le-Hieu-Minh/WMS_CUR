import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { warehouseRepository } from './warehouse.repository.js';

function normalizeCode(code) {
  return code.trim().toUpperCase();
}

function buildWhere(filters) {
  const where = {};

  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } },
      { address: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return where;
}

async function assertCodeUnique(code, excludeId = null) {
  const existing = await warehouseRepository.findByCode(code);
  if (existing && existing.id !== excludeId) {
    throw new ApiError(HttpStatus.CONFLICT, 'Mã kho đã tồn tại');
  }
}

export const warehouseService = {
  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      warehouseRepository.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortOrder } }),
      warehouseRepository.count(where),
    ]);

    return { items, pagination: buildPagination(page, limit, total) };
  },

  async getById(id) {
    const item = await warehouseRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy kho');
    return item;
  },

  async create(payload) {
    const code = normalizeCode(payload.code);
    await assertCodeUnique(code);

    return warehouseRepository.create({
      code,
      name: payload.name.trim(),
      address: payload.address ?? null,
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      description: payload.description ?? null,
      status: 'ACTIVE',
    });
  },

  async update(id, payload) {
    const item = await warehouseRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy kho');

    if (payload.code) {
      const code = normalizeCode(payload.code);
      await assertCodeUnique(code, id);
      payload.code = code;
    }

    return warehouseRepository.update(id, {
      ...(payload.code !== undefined && { code: payload.code }),
      ...(payload.name !== undefined && { name: payload.name.trim() }),
      ...(payload.address !== undefined && { address: payload.address }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
      ...(payload.email !== undefined && { email: payload.email }),
      ...(payload.description !== undefined && { description: payload.description }),
    });
  },

  async changeStatus(id, status) {
    const item = await warehouseRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy kho');
    return warehouseRepository.update(id, { status });
  },

  async softDelete(id) {
    return this.changeStatus(id, 'INACTIVE');
  },
};
