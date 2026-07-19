import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { customerRepository } from './customer.repository.js';

function normalizeCode(code) {
  return code.trim().toUpperCase();
}

function buildWhere(filters) {
  const where = {};

  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } },
      { contactPerson: { contains: filters.search, mode: 'insensitive' } },
      { phone: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  return where;
}

async function assertCodeUnique(code, excludeId = null) {
  const existing = await customerRepository.findByCode(code);
  if (existing && existing.id !== excludeId) {
    throw new ApiError(HttpStatus.CONFLICT, 'Mã khách hàng đã tồn tại');
  }
}

export const customerService = {
  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      customerRepository.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortOrder } }),
      customerRepository.count(where),
    ]);

    return { items, pagination: buildPagination(page, limit, total) };
  },

  async getById(id) {
    const item = await customerRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy khách hàng');
    return item;
  },

  async create(payload) {
    const code = normalizeCode(payload.code);
    await assertCodeUnique(code);

    return customerRepository.create({
      code,
      name: payload.name.trim(),
      contactPerson: payload.contactPerson ?? null,
      phone: payload.phone ?? null,
      email: payload.email ?? null,
      address: payload.address ?? null,
      notes: payload.notes ?? null,
      status: 'ACTIVE',
    });
  },

  async update(id, payload) {
    const item = await customerRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy khách hàng');

    if (payload.code) {
      const code = normalizeCode(payload.code);
      await assertCodeUnique(code, id);
      payload.code = code;
    }

    return customerRepository.update(id, {
      ...(payload.code !== undefined && { code: payload.code }),
      ...(payload.name !== undefined && { name: payload.name.trim() }),
      ...(payload.contactPerson !== undefined && { contactPerson: payload.contactPerson }),
      ...(payload.phone !== undefined && { phone: payload.phone }),
      ...(payload.email !== undefined && { email: payload.email }),
      ...(payload.address !== undefined && { address: payload.address }),
      ...(payload.notes !== undefined && { notes: payload.notes }),
    });
  },

  async changeStatus(id, status) {
    const item = await customerRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy khách hàng');
    return customerRepository.update(id, { status });
  },

  async softDelete(id) {
    return this.changeStatus(id, 'INACTIVE');
  },
};
