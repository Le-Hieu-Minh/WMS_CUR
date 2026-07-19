import { MasterDataListPage } from '@/features/master-data/components/MasterDataListPage';
import { productApi } from '@/features/master-data/api/masterDataApi';
import { productSchema } from '@/features/master-data/schemas/masterDataSchema';

const fields = [
  { name: 'code', label: 'Mã SP', placeholder: 'PRD-001' },
  { name: 'name', label: 'Tên sản phẩm', placeholder: 'Laptop Dell' },
  { name: 'category', label: 'Danh mục' },
  { name: 'unit', label: 'Đơn vị', placeholder: 'pcs' },
  { name: 'price', label: 'Giá bán', type: 'number', step: '0.01' },
  { name: 'costPrice', label: 'Giá vốn', type: 'number', step: '0.01' },
  { name: 'minStock', label: 'Tồn tối thiểu', type: 'number' },
  { name: 'description', label: 'Mô tả', type: 'textarea' },
];

const columns = [
  { key: 'code', label: 'Mã' },
  { key: 'name', label: 'Tên' },
  { key: 'category', label: 'Danh mục' },
  { key: 'unit', label: 'ĐVT' },
  {
    key: 'price',
    label: 'Giá bán',
    render: (item) => Number(item.price).toLocaleString('vi-VN'),
  },
];

export default function ProductsPage() {
  return (
    <MasterDataListPage
      title="Sản phẩm"
      description="Quản lý danh mục sản phẩm"
      queryKey="products"
      api={productApi}
      schema={productSchema}
      fields={fields}
      columns={columns}
      permissions={{ create: 'product:create', update: 'product:update', delete: 'product:delete' }}
      defaultValues={{
        code: '',
        name: '',
        category: '',
        unit: 'pcs',
        price: 0,
        costPrice: 0,
        minStock: 0,
        description: '',
      }}
    />
  );
}
