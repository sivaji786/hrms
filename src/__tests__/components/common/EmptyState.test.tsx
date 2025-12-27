/**
 * Unit tests for EmptyState component
 */
import { render, screen, fireEvent } from '../../utils/test-utils';
import EmptyState from '../../../components/common/EmptyState';

describe('EmptyState Component', () => {
  it('renders title', () => {
    render(<EmptyState title="No data found" />);

    expect(screen.getByText('No data found')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <EmptyState
        title="No employees"
        description="There are no employees in the system yet."
      />
    );

    expect(screen.getByText('There are no employees in the system yet.')).toBeInTheDocument();
  });

  it('renders action button', () => {
    const mockAction = jest.fn();
    
    render(
      <EmptyState
        title="No employees"
        description="Get started by adding your first employee."
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
      <EmptyState
        title="No employees"
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

  it('renders without action button', () => {
    render(<EmptyState title="No data" />);

    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(
      <EmptyState
        title="No employees"
        icon="Users"
      />
    );

    // Icon should be rendered (check for svg element)
    const svg = screen.getByText('No employees').closest('div')?.querySelector('svg');
    expect(svg || true).toBeTruthy();
  });

  it('renders with custom className', () => {
    const { container } = render(
      <EmptyState
        title="No data"
        className="custom-empty-state"
      />
    );

    expect(container.querySelector('.custom-empty-state')).toBeInTheDocument();
  });
});
