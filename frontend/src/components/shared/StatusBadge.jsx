import { Badge } from '@/components/ui/badge';

const statusConfig = {
  ACTIVE: { label: 'Hoạt động', variant: 'success' },
  INACTIVE: { label: 'Ngừng', variant: 'secondary' },
  LOCKED: { label: 'Khóa', variant: 'destructive' },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || { label: status, variant: 'outline' };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
