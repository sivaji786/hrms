/**
 * Unit tests for StatCard component
 */
import { render, screen } from '../../utils/test-utils';
import StatCard from '../../../components/common/StatCard';
import { Users } from 'lucide-react';

describe('StatCard Component', () => {
  it('renders default variant correctly', () => {
    render(
      <StatCard
        title="Total Employees"
        value={150}
        icon={Users}
        iconColor="text-blue-500"
      />
    );

    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('renders gradient variant correctly', () => {
    render(
      <StatCard
        title="Present Today"
        value={142}
        icon={Users}
        iconColor="text-green-500"
        iconBgColor="bg-green-500"
        borderColor="border-t-green-500"
        variant="gradient"
      />
    );

    expect(screen.getByText('Present Today')).toBeInTheDocument();
    expect(screen.getByText('142')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(
      <StatCard
        title="Total Employees"
        value={150}
        subtitle="Active: 145"
        icon={Users}
      />
    );

    expect(screen.getByText('Active: 145')).toBeInTheDocument();
  });

  it('renders with string trend', () => {
    render(
      <StatCard
        title="Total Employees"
        value={150}
        trend="+5 from last month"
        icon={Users}
      />
    );

    expect(screen.getByText('+5 from last month')).toBeInTheDocument();
  });

  it('renders with positive trend object', () => {
    render(
      <StatCard
        title="Total Employees"
        value={150}
        trend={{ value: 5, isPositive: true }}
        icon={Users}
      />
    );

    expect(screen.getByText(/↑/)).toBeInTheDocument();
    expect(screen.getByText(/5%/)).toBeInTheDocument();
  });

  it('renders with negative trend object', () => {
    render(
      <StatCard
        title="Total Employees"
        value={150}
        trend={{ value: 3, isPositive: false }}
        icon={Users}
      />
    );

    expect(screen.getByText(/↓/)).toBeInTheDocument();
    expect(screen.getByText(/3%/)).toBeInTheDocument();
  });

  it('accepts string value', () => {
    render(
      <StatCard
        title="Total Salary"
        value="₹45,00,000"
        icon={Users}
      />
    );

    expect(screen.getByText('₹45,00,000')).toBeInTheDocument();
  });

  it('accepts number value', () => {
    render(
      <StatCard
        title="Total Employees"
        value={150}
        icon={Users}
      />
    );

    expect(screen.getByText('150')).toBeInTheDocument();
  });
});
