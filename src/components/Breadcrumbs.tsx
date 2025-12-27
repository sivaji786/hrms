import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm mb-6">
      <button
        onClick={items[0]?.onClick}
        className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Home className="w-4 h-4" />
      </button>
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
