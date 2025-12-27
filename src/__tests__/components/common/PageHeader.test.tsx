/**
 * Unit tests for PageHeader component
 */
import { render, screen, fireEvent } from '../../utils/test-utils';
import PageHeader from '../../../components/common/PageHeader';

describe('PageHeader Component', () => {
  it('renders title', () => {
    render(<PageHeader title="Employee Management" />);

    expect(screen.getByText('Employee Management')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(
      <PageHeader
        title="Employee Management"
        subtitle="Manage all employee information"
      />
    );

    expect(screen.getByText('Manage all employee information')).toBeInTheDocument();
  });

  it('renders action button', () => {
    const mockAction = jest.fn();
    
    render(
      <PageHeader
        title="Employee Management"
        action={{
          label: 'Add Employee',
          onClick: mockAction,
        }}
      />
    );

    const button = screen.getByRole('button', { name: /add employee/i });
    expect(button).toBeInTheDocument();
  });

  it('calls action onClick when button is clicked', () => {
    const mockAction = jest.fn();
    
    render(
      <PageHeader
        title="Employee Management"
        action={{
          label: 'Add Employee',
          onClick: mockAction,
        }}
      />
    );

    const button = screen.getByRole('button', { name: /add employee/i });
    fireEvent.click(button);

    expect(mockAction).toHaveBeenCalledTimes(1);
  });

  it('renders with icon in action button', () => {
    const mockAction = jest.fn();
    
    render(
      <PageHeader
        title="Employee Management"
        action={{
          label: 'Add Employee',
          onClick: mockAction,
          icon: 'Plus',
        }}
      />
    );

    const button = screen.getByRole('button', { name: /add employee/i });
    expect(button).toBeInTheDocument();
  });

  it('renders without action button', () => {
    render(<PageHeader title="Employee Management" />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('renders with breadcrumbs', () => {
    render(
      <PageHeader
        title="Employee Details"
        breadcrumbs={['Dashboard', 'Employees', 'John Doe']}
      />
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
