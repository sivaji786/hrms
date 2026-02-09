import { Card, CardContent } from '../ui/card';
import { LucideIcon } from 'lucide-react';
import { ComponentType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number | React.ReactNode;
  subtitle?: string;
  icon: LucideIcon | ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBgColor?: string;
  borderColor?: string;
  trend?: string | {
    value: string | number;
    isPositive?: boolean;
  };
  trendColor?: string;
  variant?: 'default' | 'gradient';
  onClick?: () => void;
}

/**
 * Professional stat card component with two variants:
 * - 'default': Simple layout with icon on the right (Payroll style)
 * - 'gradient': Card with colored side panel and icon (Attendance style)
 */
export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-500',
  iconBgColor = 'bg-blue-500',
  borderColor = 'border-t-blue-500',
  trend,
  trendColor = 'text-gray-500',
  variant = 'default',
  onClick,
}: StatCardProps) {
  // Helper function to render trend
  const renderTrend = () => {
    if (!trend) return null;

    if (typeof trend === 'string') {
      return <p className={`text-sm mt-1 ${trendColor}`}>{trend}</p>;
    }

    // Handle trend object
    const trendColorClass = trend.isPositive ? 'text-green-600' : 'text-red-600';
    const trendSymbol = trend.isPositive ? '↑' : '↓';
    return (
      <p className={`text-sm mt-1 ${trendColorClass}`}>
        {trendSymbol} {trend.value}%
      </p>
    );
  };

  if (variant === 'default') {
    // Simple payroll style
    return (
      <Card
        className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{title}</p>
              <h3 className="text-2xl mt-1 font-medium text-gray-900">{value}</h3>
              {subtitle && (
                <p className={`text-sm mt-1 ${trendColor}`}>
                  {subtitle}
                </p>
              )}
              {renderTrend()}
            </div>
            <Icon className={`w-10 h-10 ${iconColor}`} />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Gradient attendance style with colored side panel
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-shadow border-t-4 ${borderColor} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="flex-1 p-6">
            <p className="text-sm text-gray-600">{title}</p>
            <h3 className="text-3xl mt-2 font-medium text-gray-900">{value}</h3>
            {subtitle && (
              <p className={`text-sm mt-2 ${trendColor}`}>
                {subtitle}
              </p>
            )}
            {renderTrend()}
          </div>
          <div className={`w-24 h-full bg-gradient-to-br ${iconBgColor} flex items-center justify-center`}>
            <Icon className="w-10 h-10 text-white opacity-80" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
