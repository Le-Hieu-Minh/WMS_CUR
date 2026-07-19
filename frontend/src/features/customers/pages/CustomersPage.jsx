import { MasterDataListPage } from '@/features/master-data/components/MasterDataListPage';
import { customerApi } from '@/features/master-data/api/masterDataApi';
import { customerSchema } from '@/features/master-data/schemas/masterDataSchema';

const fields = [
  { name: 'code', label: 'Mã KH', placeholder: 'CUS-001' },
  { name: 'name', label: 'Tên KH', placeholder: 'Công ty Alpha' },
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

export default function CustomersPage() {
  return (
    <MasterDataListPage
      title="Khách hàng"
      description="Quản lý khách hàng"
      queryKey="customers"
      api={customerApi}
      schema={customerSchema}
      fields={fields}
      columns={columns}
      permissions={{ create: 'customer:create', update: 'customer:update', delete: 'customer:delete' }}
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
