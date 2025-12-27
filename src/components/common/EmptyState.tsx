import { Card, CardContent } from '../ui/card';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  description?: string;
}

export default function EmptyState({ icon: Icon, message, description }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-500">{message}</p>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </CardContent>
    </Card>
  );
}
