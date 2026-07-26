import { Badge } from '@/components/ui/badge';

const statusConfig = {
  ACTIVE: { label: 'Hoạt động', variant: 'success' },
  INACTIVE: { label: 'Ngừng', variant: 'secondary' },
  LOCKED: { label: 'Khóa', variant: 'destructive' },
  DRAFT: { label: 'Nháp', variant: 'warning' },
  CONFIRMED: { label: 'Đã xác nhận', variant: 'success' },
  CANCELLED: { label: 'Đã hủy', variant: 'secondary' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, variant: 'outline' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
