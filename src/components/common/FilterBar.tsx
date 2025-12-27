import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Search } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
}

export default function FilterBar({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters = [],
}: FilterBarProps) {
  const totalCols = 1 + filters.length;
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(totalCols, 6)} gap-4`}>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Dynamic Filters */}
          {filters.map((filter, index) => (
            <Select key={index} value={filter.value} onValueChange={filter.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}