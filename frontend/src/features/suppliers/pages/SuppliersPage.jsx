import { MasterDataListPage } from '@/features/master-data/components/MasterDataListPage';
import { supplierApi } from '@/features/master-data/api/masterDataApi';
import { supplierSchema } from '@/features/master-data/schemas/masterDataSchema';

const fields = [
  { name: 'code', label: 'Mã NCC', placeholder: 'SUP-001' },
  { name: 'name', label: 'Tên NCC', placeholder: 'Công ty ABC' },
  { name: 'contactPerson', label: 'Người liên hệ' },
  { name: 'phone', label: 'Điện thoại' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'address', label: 'Địa chỉ', type: 'textarea' },
  { name: 'notes', label: 'Ghi chú', type: 'textarea' },
];

const columns = [
  { key: 'code', label: 'Mã' },
  { key: 'name', label: 'Tên' },
  { key: 'contactPerson', label: 'Liên hệ' },
  { key: 'phone', label: 'Điện thoại' },
];

export default function SuppliersPage() {
  return (
    <MasterDataListPage
      title="Nhà cung cấp"
      description="Quản lý nhà cung cấp"
      queryKey="suppliers"
      api={supplierApi}
      schema={supplierSchema}
      fields={fields}
      columns={columns}
      permissions={{ create: 'supplier:create', update: 'supplier:update', delete: 'supplier:delete' }}
      defaultValues={{
        code: '',
        name: '',
        contactPerson: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
      }}
    />
  );
}
