import { Button } from '../ui/button';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionButton?: {
    label: string;
    icon?: LucideIcon;
    onClick: () => void;
  };
  rightElement?: React.ReactNode;
}

export default function PageHeader({ title, description, actionButton, rightElement }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h2 className="text-2xl text-gray-900">{title}</h2>
        {description && <p className="text-gray-600 mt-1">{description}</p>}
      </div>
      {actionButton && (
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
          onClick={actionButton.onClick}
        >
          {actionButton.icon && <actionButton.icon className="w-4 h-4 mr-2" />}
          {actionButton.label}
        </Button>
      )}
      {rightElement}
    </div>
  );
}
