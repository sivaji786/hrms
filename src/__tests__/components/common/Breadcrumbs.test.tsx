/**
 * Unit tests for Breadcrumbs component
 */
import { render, screen } from '../../utils/test-utils';
import Breadcrumbs from '../../../components/Breadcrumbs';

describe('Breadcrumbs Component', () => {
  it('renders single breadcrumb item', () => {
    render(<Breadcrumbs items={['Dashboard']} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders multiple breadcrumb items', () => {
    render(
      <Breadcrumbs items={['Dashboard', 'Employees', 'Rajesh Kumar']} />
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Employees')).toBeInTheDocument();
    expect(screen.getByText('Rajesh Kumar')).toBeInTheDocument();
  });

  it('renders separators between items', () => {
    const { container } = render(
      <Breadcrumbs items={['Dashboard', 'Employees', 'Details']} />
    );

    // Check for chevron separators
    const separators = container.querySelectorAll('svg');
    expect(separators.length).toBeGreaterThan(0);
  });

  it('last item is not clickable', () => {
    render(
      <Breadcrumbs items={['Dashboard', 'Employees', 'Current Page']} />
    );

    const lastItem = screen.getByText('Current Page');
    expect(lastItem).not.toHaveAttribute('href');
  });

  it('renders empty when no items provided', () => {
    const { container } = render(<Breadcrumbs items={[]} />);

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('handles special characters in breadcrumb items', () => {
    render(
      <Breadcrumbs items={['Dashboard', 'Expense & Travel', 'Submit Expense']} />
    );

    expect(screen.getByText('Expense & Travel')).toBeInTheDocument();
  });
});
