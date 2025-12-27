import { Card, CardContent } from '../ui/card';
import { ReactNode, useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Button } from '../ui/button';
import { Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import toast from '../../utils/toast';

export interface TableColumn {
  header: string | ReactNode;
  accessor?: string;
  cell?: (row: any) => ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
  sortKey?: string; // Custom key for sorting if different from accessor
}

export interface DataTableProps {
  // Data & Columns
  columns: TableColumn[];
  data: any[];
  
  // Selection
  selectable?: boolean;
  selectedRows?: any[];
  onSelectRow?: (rowId: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  getRowId?: (row: any) => string | number;
  
  // Export
  exportable?: boolean;
  exportFileName?: string;
  exportHeaders?: string[];
  onExportSelected?: () => void; // Custom export handler
  
  // Sorting
  sortable?: boolean;
  defaultSortKey?: string;
  defaultSortOrder?: 'asc' | 'desc';
  
  // Styling
  headerStyle?: 'simple' | 'gradient';
  headerClassName?: string;
  rowClassName?: string | ((row: any) => string);
  cellPadding?: 'compact' | 'normal' | 'relaxed';
  striped?: boolean;
  
  // Behavior
  emptyMessage?: string;
  onRowClick?: (row: any) => void;
  hoverable?: boolean;
  
  // Card Wrapper
  withCard?: boolean;
  cardClassName?: string;
  
  // Loading
  loading?: boolean;
  loadingRows?: number;
}

/**
 * Enhanced DataTable component with support for:
 * - Row selection with checkboxes
 * - Export selected rows to CSV
 * - Column-wise sorting
 * - Multiple header styles (simple/gradient)
 * - Custom cell renderers
 * - Avatar, badges, and action buttons
 * - Configurable padding and styling
 * - Optional card wrapper
 * - Loading states
 */
export default function DataTable({ 
  // Data & Columns
  columns, 
  data, 
  
  // Selection
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  getRowId = (row) => row.id,
  
  // Export
  exportable = false,
  exportFileName = 'export',
  exportHeaders,
  onExportSelected,
  
  // Sorting
  sortable = false,
  defaultSortKey,
  defaultSortOrder = 'asc',
  
  // Styling
  headerStyle = 'simple',
  headerClassName,
  rowClassName,
  cellPadding = 'normal',
  striped = false,
  
  // Behavior
  emptyMessage = 'No data available',
  onRowClick,
  hoverable = true,
  
  // Card Wrapper
  withCard = true,
  cardClassName,
  
  // Loading
  loading = false,
  loadingRows = 5,
}: DataTableProps) {
  
  // Sorting state
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);

  // Handle column sort
  const handleSort = (column: TableColumn) => {
    if (!column.sortable && !sortable) return;
    
    const key = column.sortKey || column.accessor;
    if (!key) return;
    
    if (sortKey === key) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to asc
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  // Sort data
  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0;
    
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    
    // Handle null/undefined
    if (aValue == null) return 1;
    if (bValue == null) return -1;
    
    // Handle numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    // Handle strings
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    
    if (sortOrder === 'asc') {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });

  // Use sorted data if sorting is active, otherwise use original data
  const displayData = sortKey ? sortedData : data;

  // Export selected rows to CSV
  const handleExportSelected = () => {
    if (onExportSelected) {
      onExportSelected();
      return;
    }

    // If no rows selected, export all filtered data
    const dataToExport = selectedRows.length > 0 ? selectedRows : displayData;

    if (dataToExport.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Get headers
    const headers = exportHeaders || columns
      .filter(col => col.accessor)
      .map(col => typeof col.header === 'string' ? col.header : col.accessor || '');

    // Get data
    const csvData = dataToExport.map(row => {
      return columns
        .filter(col => col.accessor)
        .map(col => {
          const value = row[col.accessor!];
          // Handle values with commas by wrapping in quotes
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value ?? '';
        })
        .join(',');
    });

    // Create CSV content
    const csvContent = [headers.join(','), ...csvData].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exportFileName}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Get padding classes based on cellPadding prop
  const getPaddingClasses = () => {
    switch (cellPadding) {
      case 'compact':
        return 'px-4 py-2';
      case 'relaxed':
        return 'px-6 py-4';
      case 'normal':
      default:
        return 'px-6 py-3';
    }
  };

  // Get header classes based on headerStyle prop
  const getHeaderClasses = () => {
    const baseClasses = 'border-b';
    const customClasses = headerClassName || '';
    
    if (headerStyle === 'gradient') {
      return `${baseClasses} bg-gradient-to-r from-gray-50 to-gray-100 ${customClasses}`;
    }
    
    return `${baseClasses} bg-gray-50 ${customClasses}`;
  };

  // Get row classes
  const getRowClasses = (row: any, index: number) => {
    let classes = 'border-b';
    
    if (hoverable) {
      classes += ' hover:bg-gray-50 transition-colors';
    }
    
    if (striped && index % 2 === 1) {
      classes += ' bg-gray-50/50';
    }
    
    if (onRowClick) {
      classes += ' cursor-pointer';
    }
    
    if (typeof rowClassName === 'function') {
      classes += ' ' + rowClassName(row);
    } else if (rowClassName) {
      classes += ' ' + rowClassName;
    }
    
    return classes;
  };

  // Check if all rows are selected
  const isAllSelected = selectable && data.length > 0 && selectedRows.length === data.length;
  const isSomeSelected = selectable && selectedRows.length > 0 && selectedRows.length < data.length;

  // Handle select all
  const handleSelectAll = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  // Handle row selection
  const handleRowSelect = (row: any, checked: boolean) => {
    if (onSelectRow) {
      onSelectRow(getRowId(row), checked);
    }
  };

  // Check if a row is selected
  const isRowSelected = (row: any) => {
    const rowId = getRowId(row);
    return selectedRows.some(selectedRow => getRowId(selectedRow) === rowId);
  };

  // Get sort icon for column
  const getSortIcon = (column: TableColumn) => {
    const key = column.sortKey || column.accessor;
    if (!key || sortKey !== key) {
      return <ArrowUpDown className="w-4 h-4 text-gray-400" />;
    }
    
    return sortOrder === 'asc' 
      ? <ArrowUp className="w-4 h-4 text-blue-600" />
      : <ArrowDown className="w-4 h-4 text-blue-600" />;
  };

  // Check if column is sortable
  const isColumnSortable = (column: TableColumn) => {
    return (column.sortable || sortable) && (column.accessor || column.sortKey);
  };

  // Render loading skeleton
  const renderLoadingSkeleton = () => (
    <>
      {Array.from({ length: loadingRows }).map((_, index) => (
        <tr key={`loading-${index}`} className="border-b">
          {selectable && (
            <td className={getPaddingClasses()}>
              <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
            </td>
          )}
          {columns.map((_, colIndex) => (
            <td key={colIndex} className={getPaddingClasses()}>
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );

  // Table content
  const tableContent = (
    <div className="space-y-0">
      {/* Export toolbar - always show when exportable is true */}
      {exportable && displayData.length > 0 && (
        <div className={`px-6 py-3 border-b flex items-center justify-between ${
          selectedRows.length > 0 
            ? 'bg-blue-50 border-blue-100' 
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="text-sm">
            {selectedRows.length > 0 ? (
              <span className="text-blue-700">
                <span className="font-medium">{selectedRows.length}</span> row{selectedRows.length > 1 ? 's' : ''} selected
              </span>
            ) : (
              <span className="text-gray-600">
                {displayData.length} row{displayData.length > 1 ? 's' : ''} available
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleExportSelected}
            className={selectedRows.length > 0 
              ? 'bg-blue-600 hover:bg-blue-700' 
              : 'bg-gray-600 hover:bg-gray-700'
            }
          >
            <Download className="w-4 h-4 mr-2" />
            {selectedRows.length > 0 ? 'Export Selected' : 'Export All'}
          </Button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={getHeaderClasses()}>
            <tr>
              {selectable && (
                <th className={`${getPaddingClasses()} text-left`}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected && !isAllSelected}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                  />
                </th>
              )}
              {columns.map((column, index) => {
                const isSortableCol = isColumnSortable(column);
                
                return (
                  <th 
                    key={column.accessor || column.header || `col-${index}`}
                    className={`${getPaddingClasses()} text-left text-xs uppercase tracking-wider ${
                      headerStyle === 'gradient' ? 'text-gray-700' : 'text-gray-500'
                    } ${column.headerClassName || ''} ${
                      isSortableCol ? 'cursor-pointer select-none hover:bg-gray-100' : ''
                    }`}
                    onClick={() => isSortableCol && handleSort(column)}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {isSortableCol && getSortIcon(column)}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={striped ? '' : 'divide-y divide-gray-200'}>
            {loading ? (
              renderLoadingSkeleton()
            ) : displayData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + (selectable ? 1 : 0)} 
                  className="py-8 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              displayData.map((row, rowIndex) => (
                <tr 
                  key={getRowId(row)} 
                  className={getRowClasses(row, rowIndex)}
                  onClick={() => onRowClick?.(row)}
                >
                  {selectable && (
                    <td className={getPaddingClasses()}>
                      <Checkbox
                        checked={isRowSelected(row)}
                        onCheckedChange={(checked) => handleRowSelect(row, checked as boolean)}
                        aria-label={`Select row ${rowIndex + 1}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>
                  )}
                  {columns.map((column, colIndex) => (
                    <td 
                      key={column.accessor || `cell-${colIndex}`}
                      className={`${getPaddingClasses()} ${column.className || ''}`}
                    >
                      {column.cell ? column.cell(row) : row[column.accessor || '']}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Return with or without card wrapper
  if (withCard) {
    return (
      <Card className={cardClassName}>
        <CardContent className="p-0">
          {tableContent}
        </CardContent>
      </Card>
    );
  }

  return tableContent;
}

// Export TableColumn type for external use
export type { TableColumn };