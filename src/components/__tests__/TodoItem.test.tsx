import { render } from "@testing-library/react";
import { screen, fireEvent, within } from "@testing-library/dom";
import { vi, describe, test, expect } from "vitest";
import TodoItem from "../TodoItem";
import { Todo } from "../TodoApp";

const mockTodo: Todo = {
  id: 1,
  title: "Test todo",
  description: "Test description",
  completed: false,
  createdAt: "2024-07-01T10:00:00.000Z",
  deadlineAt: "2024-07-10T10:00:00.000Z",
  completedAt: undefined,
  priority: "high",
};

describe("TodoItem", () => {
  test("renders todo title, description, priority, and dates", () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();

    const { container } = render(
      <TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />
    );

    const todoWrapper = container; // or add `data-testid="todo-item"` nếu cần giới hạn

    expect(screen.getByText("Test todo")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();

    // Ưu tiên cao có thể xuất hiện ở badge và nút => check bằng getAllByText
    const priorityBadges = screen.getAllByText(/Ưu tiên cao/);
    expect(priorityBadges.length).toBeGreaterThanOrEqual(1);

    expect(screen.getByText("🔴 Ưu tiên cao")).toBeInTheDocument();
    expect(screen.getByText(/Tạo:/i)).toBeInTheDocument();
    expect(screen.getByText(/Hạn:/i)).toBeInTheDocument();
  });

  test("calls onToggle when checkbox is clicked", () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();

    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const toggleButton = screen.getByRole("button", { name: /Mark as complete/i });
    fireEvent.click(toggleButton);
    expect(mockOnToggle).toHaveBeenCalledWith(1);
  });

  test("calls onDelete when delete button is clicked", () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();

    render(<TodoItem todo={mockTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByRole("button", { name: /Delete todo/i });
    fireEvent.click(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  test("shows completed styling and completedAt date for completed todo", () => {
    const completedTodo = {
      ...mockTodo,
      completed: true,
      completedAt: "2024-07-11T12:00:00.000Z",
    };

    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();

    render(<TodoItem todo={completedTodo} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const todoText = screen.getByText("Test todo");
    expect(todoText).toHaveClass("line-through");

    expect(screen.getByText(/Hoàn thành:/i)).toBeInTheDocument();
  });
});
