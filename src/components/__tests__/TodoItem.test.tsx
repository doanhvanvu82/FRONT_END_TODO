
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import TodoItem from '../TodoItem';
import { Todo } from '../TodoApp';

const mockTodo: Todo = {
  id: 1,
  text: 'Test todo',
  completed: false,
};

describe('TodoItem', () => {
  test('renders todo text correctly', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    expect(screen.getByText('Test todo')).toBeInTheDocument();
  });

  test('calls onToggle when checkbox is clicked', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const checkbox = screen.getByRole('button', { name: /Mark as complete/i });
    fireEvent.click(checkbox);
    
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  test('calls onDelete when delete button is clicked', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    
    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const deleteButton = screen.getByRole('button', { name: /Delete todo/i });
    fireEvent.click(deleteButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test('shows completed styling for completed todo', () => {
    const completedTodo = { ...mockTodo, completed: true };
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    
    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    
    const todoText = screen.getByText('Test todo');
    expect(todoText).toHaveClass('line-through');
  });
});
