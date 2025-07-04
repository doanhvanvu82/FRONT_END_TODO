
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
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

  test('renders todo app with initial todos', async () => {
    render(<TodoApp />);
    
    // Check if loading spinner appears initially
    expect(screen.getByText('Loading todos...')).toBeInTheDocument();
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Build Todo App')).toBeInTheDocument();
    expect(screen.getByText('Write Tests')).toBeInTheDocument();
  });

  test('adds a new todo when form is submitted', async () => {
    render(<TodoApp />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText('What do you need to do?');
    const addButton = screen.getByText('Add');
    
    fireEvent.change(input, { target: { value: 'New test todo' } });
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(screen.getByText('New test todo')).toBeInTheDocument();
    });
  });

  test('toggles todo completion when checkbox is clicked', async () => {
    render(<TodoApp />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });
    
    const checkboxes = screen.getAllByRole('button', { name: /Mark as complete/i });
    fireEvent.click(checkboxes[0]);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Mark as incomplete/i })).toBeInTheDocument();
    });
  });
});
