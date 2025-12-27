/**
 * Unit tests for ConfirmDialog component
 */
import { render, screen, fireEvent } from '../../utils/test-utils';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

describe('ConfirmDialog Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    mockOnConfirm.mockClear();
    mockOnCancel.mockClear();
  });

  it('renders when open is true', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
  });

  it('does not render when open is false', () => {
    render(
      <ConfirmDialog
        open={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Delete Employee"
        message="This action cannot be undone."
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm|yes|delete/i });
    fireEvent.click(confirmButton);

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Delete Employee"
        message="This action cannot be undone."
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel|no/i });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('renders custom confirm button text', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Delete Employee"
        message="Are you sure?"
        confirmText="Delete"
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('renders custom cancel button text', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Delete Employee"
        message="Are you sure?"
        cancelText="Keep"
      />
    );

    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
  });

  it('renders danger variant with red styling', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Delete Employee"
        message="This action cannot be undone."
        variant="danger"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /confirm|yes|delete/i });
    expect(confirmButton).toHaveClass('bg-red-600', 'destructive');
  });

  it('renders warning variant', () => {
    render(
      <ConfirmDialog
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        title="Warning"
        message="Please review before proceeding."
        variant="warning"
      />
    );

    expect(screen.getByText('Warning')).toBeInTheDocument();
  });
});
