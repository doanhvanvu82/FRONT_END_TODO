import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
    
    waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Build Todo App')).toBeInTheDocument();
    expect(screen.getByText('Write Tests')).toBeInTheDocument();
  });

  test('allows adding new todos', async () => {
    render(<TodoApp />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText('What do you need to do?');
    const addButton = screen.getByText('Add');

    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('New Todo')).toBeInTheDocument();
    });
  });

  test('allows toggling todo completion', async () => {
    render(<TodoApp />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const toggleButton = screen.getAllByRole('button', { name: /Mark as complete/i })[0];
    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(screen.getByText('Learn React')).toHaveClass('line-through');
    });
  });
});
