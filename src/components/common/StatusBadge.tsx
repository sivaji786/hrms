import { Badge } from '../ui/badge';

type StatusType = 
  | 'success' | 'error' | 'warning' | 'info' 
  | 'approved' | 'rejected' | 'pending' | 'draft'
  | 'active' | 'inactive' | 'completed' | 'in-progress'
  | 'open' | 'closed' | 'critical' | 'high' | 'medium' | 'low';

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  variant?: 'default' | 'outline';
}

const statusColorMap: Record<string, string> = {
  // General statuses
  'success': 'bg-green-100 text-green-700 border-green-200',
  'error': 'bg-red-100 text-red-700 border-red-200',
  'warning': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'info': 'bg-blue-100 text-blue-700 border-blue-200',
  
  // Approval statuses
  'approved': 'bg-green-100 text-green-700 border-green-200',
  'rejected': 'bg-red-100 text-red-700 border-red-200',
  'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'draft': 'bg-gray-100 text-gray-700 border-gray-200',
  
  // Activity statuses
  'active': 'bg-green-100 text-green-700 border-green-200',
  'inactive': 'bg-gray-100 text-gray-700 border-gray-200',
  'completed': 'bg-green-100 text-green-700 border-green-200',
  'in-progress': 'bg-blue-100 text-blue-700 border-blue-200',
  
  // Ticket/Issue statuses
  'open': 'bg-blue-100 text-blue-700 border-blue-200',
  'closed': 'bg-gray-100 text-gray-700 border-gray-200',
  
  // Priority levels
  'critical': 'bg-red-100 text-red-700 border-red-200',
  'high': 'bg-orange-100 text-orange-700 border-orange-200',
  'medium': 'bg-blue-100 text-blue-700 border-blue-200',
  'low': 'bg-green-100 text-green-700 border-green-200',
};

export default function StatusBadge({ status, type, variant = 'default' }: StatusBadgeProps) {
  const normalizedStatus = (type || status.toLowerCase().replace(/ /g, '-'));
  const colorClass = statusColorMap[normalizedStatus] || 'bg-gray-100 text-gray-700 border-gray-200';
  
  return (
    <Badge className={colorClass} variant={variant}>
      {status}
    </Badge>
  );
}
