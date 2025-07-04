import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import TodoApp from '../TodoApp';

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('TodoApp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<TodoApp />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders todos with correct fields', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('Học React Hooks')).toBeInTheDocument();
      expect(screen.getByText('Viết unit test với Jest')).toBeInTheDocument();
      expect(screen.getByText('Thiết kế giao diện responsive')).toBeInTheDocument();
    });
    // Check for priority badges
    expect(screen.getByText('Ưu tiên cao')).toBeInTheDocument();
    expect(screen.getByText('Trung bình')).toBeInTheDocument();
    expect(screen.getByText('Thấp')).toBeInTheDocument();
    // Check for date labels
    expect(screen.getAllByText(/Tạo:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hạn:/i).length).toBeGreaterThan(0);
  });

  test('allows toggling todo completion', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('Học React Hooks')).toBeInTheDocument();
    });
    const toggleButton = screen.getAllByRole('button', { name: /Mark as complete/i })[0];
    fireEvent.click(toggleButton);
    await waitFor(() => {
      expect(screen.getByText('Học React Hooks')).toHaveClass('line-through');
    });
  });

  test('allows deleting a todo', async () => {
    render(<TodoApp />);
    await waitFor(() => {
      expect(screen.getByText('Học React Hooks')).toBeInTheDocument();
    });
    const deleteButtons = screen.getAllByRole('button', { name: /Delete todo/i });
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.queryByText('Học React Hooks')).not.toBeInTheDocument();
    });
  });
});
