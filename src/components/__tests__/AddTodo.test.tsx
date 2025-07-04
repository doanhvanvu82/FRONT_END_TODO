
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, test, expect } from 'vitest';
import AddTodo from '../AddTodo';

describe('AddTodo', () => {
  test('calls onAdd with input value when form is submitted', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('What do you need to do?');
    const button = screen.getByText('Add');
    
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.click(button);
    
    expect(mockOnAdd).toHaveBeenCalledWith('Test todo');
  });

  test('does not call onAdd with empty input', () => {
    const mockOnAdd = vi.fn();
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const button = screen.getByText('Add');
    
    fireEvent.click(button);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  test('clears input after successful submission', async () => {
    const mockOnAdd = vi.fn().mockResolvedValue(undefined);
    render(<AddTodo onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('What do you need to do?') as HTMLInputElement;
    
    fireEvent.change(input, { target: { value: 'Test todo' } });
    fireEvent.submit(input.closest('form')!);
    
    // Input should be cleared after submission
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(input.value).toBe('');
  });
});
