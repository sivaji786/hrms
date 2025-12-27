/**
 * Unit tests for FilterBar component
 */
import { render, screen, fireEvent } from '../../utils/test-utils';
import FilterBar from '../../../components/common/FilterBar';

describe('FilterBar Component', () => {
  const mockOnFilterChange = jest.fn();
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
    mockOnSearch.mockClear();
  });

  it('renders search input', () => {
    render(
      <FilterBar
        onSearch={mockOnSearch}
        searchPlaceholder="Search employees..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search employees...');
    expect(searchInput).toBeInTheDocument();
  });

  it('calls onSearch when typing in search input', () => {
    render(
      <FilterBar
        onSearch={mockOnSearch}
        searchPlaceholder="Search..."
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'John' } });

    expect(mockOnSearch).toHaveBeenCalledWith('John');
  });

  it('renders filter dropdowns', () => {
    const filters = [
      {
        label: 'Department',
        options: ['Engineering', 'HR', 'Sales'],
        value: '',
        onChange: mockOnFilterChange,
      },
    ];

    render(
      <FilterBar
        filters={filters}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('calls onChange when filter is selected', () => {
    const filters = [
      {
        label: 'Status',
        options: ['Active', 'Inactive'],
        value: '',
        onChange: mockOnFilterChange,
      },
    ];

    render(
      <FilterBar
        filters={filters}
        onSearch={mockOnSearch}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'Active' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('Active');
  });

  it('displays selected filter value', () => {
    const filters = [
      {
        label: 'Status',
        options: ['Active', 'Inactive'],
        value: 'Active',
        onChange: mockOnFilterChange,
      },
    ];

    render(
      <FilterBar
        filters={filters}
        onSearch={mockOnSearch}
      />
    );

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('Active');
  });

  it('renders multiple filters', () => {
    const filters = [
      {
        label: 'Department',
        options: ['Engineering', 'HR'],
        value: '',
        onChange: mockOnFilterChange,
      },
      {
        label: 'Status',
        options: ['Active', 'Inactive'],
        value: '',
        onChange: mockOnFilterChange,
      },
    ];

    render(
      <FilterBar
        filters={filters}
        onSearch={mockOnSearch}
      />
    );

    expect(screen.getByText('Department')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });
});
