import { z } from 'zod';

export const warehouseSchema = z.object({
  code: z.string().trim().min(1, 'Mã kho là bắt buộc'),
  name: z.string().trim().min(2, 'Tên kho tối thiểu 2 ký tự'),
  address: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('Email không hợp lệ').optional().or(z.literal('')),
  description: z.string().trim().optional(),
});

export const productSchema = z.object({
  code: z.string().trim().min(1, 'Mã sản phẩm là bắt buộc'),
  name: z.string().trim().min(2, 'Tên sản phẩm tối thiểu 2 ký tự'),
  description: z.string().trim().optional(),
  category: z.string().trim().optional(),
  unit: z.string().trim().min(1).default('pcs'),
  price: z.coerce.number().min(0).default(0),
  costPrice: z.coerce.number().min(0).default(0),
  minStock: z.coerce.number().int().min(0).default(0),
});

export const supplierSchema = z.object({
  code: z.string().trim().min(1, 'Mã NCC là bắt buộc'),
  name: z.string().trim().min(2, 'Tên NCC tối thiểu 2 ký tự'),
  contactPerson: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('Email không hợp lệ').optional().or(z.literal('')),
  address: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const customerSchema = z.object({
  code: z.string().trim().min(1, 'Mã KH là bắt buộc'),
  name: z.string().trim().min(2, 'Tên KH tối thiểu 2 ký tự'),
  contactPerson: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z.string().trim().email('Email không hợp lệ').optional().or(z.literal('')),
  address: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});
