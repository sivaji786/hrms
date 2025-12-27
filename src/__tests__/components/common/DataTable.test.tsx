/**
 * Unit tests for DataTable component
 */
import { render, screen } from '../../utils/test-utils';
import DataTable from '../../../components/common/DataTable';
import { mockEmployees } from '../../utils/mockData';

describe('DataTable Component', () => {
  const columns = [
    {
      header: 'Name',
      accessor: (item: any) => item.name,
    },
    {
      header: 'Email',
      accessor: (item: any) => item.email,
    },
    {
      header: 'Department',
      accessor: (item: any) => item.department,
    },
  ];

  it('renders table with data', () => {
    render(
      <DataTable
        columns={columns}
        data={mockEmployees}
      />
    );

    // Check headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();

    // Check data rows
    expect(screen.getByText('Rajesh Kumar')).toBeInTheDocument();
    expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
    expect(screen.getByText('Amit Patel')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        emptyMessage="No employees found"
      />
    );

    expect(screen.getByText('No employees found')).toBeInTheDocument();
  });

  it('renders with actions column', () => {
    const columnsWithActions = [
      ...columns,
      {
        header: 'Actions',
        accessor: () => 'View',
      },
    ];

    render(
      <DataTable
        columns={columnsWithActions}
        data={mockEmployees}
      />
    );

    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('handles custom accessor functions', () => {
    const customColumns = [
      {
        header: 'Full Name',
        accessor: (item: any) => `${item.name} (${item.position})`,
      },
    ];

    render(
      <DataTable
        columns={customColumns}
        data={[mockEmployees[0]]}
      />
    );

    expect(screen.getByText('Rajesh Kumar (Senior Developer)')).toBeInTheDocument();
  });
});
