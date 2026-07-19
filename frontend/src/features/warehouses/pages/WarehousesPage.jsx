import { MasterDataListPage } from '@/features/master-data/components/MasterDataListPage';
import { warehouseApi } from '@/features/master-data/api/masterDataApi';
import { warehouseSchema } from '@/features/master-data/schemas/masterDataSchema';

const fields = [
  { name: 'code', label: 'Mã kho', placeholder: 'WH-001' },
  { name: 'name', label: 'Tên kho', placeholder: 'Kho chính' },
  { name: 'address', label: 'Địa chỉ', type: 'textarea' },
  { name: 'phone', label: 'Điện thoại' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'description', label: 'Mô tả', type: 'textarea' },
];

const columns = [
  { key: 'code', label: 'Mã' },
  { key: 'name', label: 'Tên kho' },
  { key: 'phone', label: 'Điện thoại' },
  { key: 'address', label: 'Địa chỉ' },
];

export default function WarehousesPage() {
  return (
    <MasterDataListPage
      title="Kho hàng"
      description="Quản lý danh sách kho"
      queryKey="warehouses"
      api={warehouseApi}
      schema={warehouseSchema}
      fields={fields}
      columns={columns}
      permissions={{ create: 'warehouse:create', update: 'warehouse:update', delete: 'warehouse:delete' }}
      defaultValues={{ code: '', name: '', address: '', phone: '', email: '', description: '' }}
    />
  );
}
