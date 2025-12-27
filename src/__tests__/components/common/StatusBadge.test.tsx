/**
 * Unit tests for StatusBadge component
 */
import { render, screen } from '../../utils/test-utils';
import StatusBadge from '../../../components/common/StatusBadge';

describe('StatusBadge Component', () => {
  it('renders success variant', () => {
    render(<StatusBadge variant="success">Approved</StatusBadge>);
    
    const badge = screen.getByText('Approved');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-green-100');
  });

  it('renders warning variant', () => {
    render(<StatusBadge variant="warning">Pending</StatusBadge>);
    
    const badge = screen.getByText('Pending');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-yellow-100');
  });

  it('renders danger variant', () => {
    render(<StatusBadge variant="danger">Rejected</StatusBadge>);
    
    const badge = screen.getByText('Rejected');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-red-100');
  });

  it('renders info variant', () => {
    render(<StatusBadge variant="info">In Progress</StatusBadge>);
    
    const badge = screen.getByText('In Progress');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-blue-100');
  });

  it('renders default variant', () => {
    render(<StatusBadge variant="default">Inactive</StatusBadge>);
    
    const badge = screen.getByText('Inactive');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-gray-100');
  });

  it('renders with custom className', () => {
    render(
      <StatusBadge variant="success" className="custom-class">
        Custom
      </StatusBadge>
    );
    
    const badge = screen.getByText('Custom');
    expect(badge).toHaveClass('custom-class');
  });
});
