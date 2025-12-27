/**
 * Unit tests for Pagination component
 */
import { render, screen, fireEvent } from '../../utils/test-utils';
import Pagination from '../../../components/common/Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('renders pagination with correct page numbers', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onPageChange when page number clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Button = screen.getByText('2');
    fireEvent.click(page2Button);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when next button clicked', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText(/next/i);
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when previous button clicked', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByLabelText(/previous/i);
    fireEvent.click(prevButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('disables previous button on first page', () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const prevButton = screen.getByLabelText(/previous/i);
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText(/next/i);
    expect(nextButton).toBeDisabled();
  });

  it('highlights current page', () => {
    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    const currentPageButton = screen.getByText('3');
    expect(currentPageButton).toHaveClass('bg-blue-600');
  });

  it('does not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination
        currentPage={1}
        totalPages={1}
        onPageChange={mockOnPageChange}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
