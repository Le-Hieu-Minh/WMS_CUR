import { ApiError, HttpStatus } from '../../utils/apiError.js';
import { buildPagination, parsePagination } from '../../utils/pagination.js';
import { productRepository } from './product.repository.js';

function normalizeCode(code) {
  return code.trim().toUpperCase();
}

function mapProduct(product) {
  return {
    ...product,
    price: Number(product.price),
    costPrice: Number(product.costPrice),
  };
}

function buildWhere(filters) {
  const where = {};

  if (filters.search) {
    where.OR = [
      { code: { contains: filters.search, mode: 'insensitive' } },
      { name: { contains: filters.search, mode: 'insensitive' } },
      { category: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.category) {
    where.category = { equals: filters.category, mode: 'insensitive' };
  }

  return where;
}

async function assertCodeUnique(code, excludeId = null) {
  const existing = await productRepository.findByCode(code);
  if (existing && existing.id !== excludeId) {
    throw new ApiError(HttpStatus.CONFLICT, 'Mã sản phẩm đã tồn tại');
  }
}

export const productService = {
  async list(query) {
    const { page, limit, skip, sortBy, sortOrder } = parsePagination(query, 'createdAt');
    const where = buildWhere(query);

    const [items, total] = await Promise.all([
      productRepository.findMany({ where, skip, take: limit, orderBy: { [sortBy]: sortOrder } }),
      productRepository.count(where),
    ]);

    return {
      items: items.map(mapProduct),
      pagination: buildPagination(page, limit, total),
    };
  },

  async getById(id) {
    const item = await productRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy sản phẩm');
    return mapProduct(item);
  },

  async create(payload) {
    const code = normalizeCode(payload.code);
    await assertCodeUnique(code);

    const item = await productRepository.create({
      code,
      name: payload.name.trim(),
      description: payload.description ?? null,
      category: payload.category ?? null,
      unit: payload.unit ?? 'pcs',
      price: payload.price ?? 0,
      costPrice: payload.costPrice ?? 0,
      minStock: payload.minStock ?? 0,
      imageUrl: payload.imageUrl ?? null,
      status: 'ACTIVE',
    });

    return mapProduct(item);
  },

  async update(id, payload) {
    const item = await productRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy sản phẩm');

    if (payload.code) {
      const code = normalizeCode(payload.code);
      await assertCodeUnique(code, id);
      payload.code = code;
    }

    const updated = await productRepository.update(id, {
      ...(payload.code !== undefined && { code: payload.code }),
      ...(payload.name !== undefined && { name: payload.name.trim() }),
      ...(payload.description !== undefined && { description: payload.description }),
      ...(payload.category !== undefined && { category: payload.category }),
      ...(payload.unit !== undefined && { unit: payload.unit }),
      ...(payload.price !== undefined && { price: payload.price }),
      ...(payload.costPrice !== undefined && { costPrice: payload.costPrice }),
      ...(payload.minStock !== undefined && { minStock: payload.minStock }),
      ...(payload.imageUrl !== undefined && { imageUrl: payload.imageUrl }),
    });

    return mapProduct(updated);
  },

  async changeStatus(id, status) {
    const item = await productRepository.findById(id);
    if (!item) throw new ApiError(HttpStatus.NOT_FOUND, 'Không tìm thấy sản phẩm');
    const updated = await productRepository.update(id, { status });
    return mapProduct(updated);
  },

  async softDelete(id) {
    return this.changeStatus(id, 'INACTIVE');
  },
};
