import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TodoItem from "../TodoItem";
import { Todo } from "../TodoApp";
import { vi, describe, it, expect } from "vitest";
import React from "react";

// Mocks cho AlertDialog (nếu dùng từ @/components/ui/alert-dialog, bạn cần mock nhẹ)
vi.mock("@/components/ui/alert-dialog", async () => {
  const actual = await vi.importActual<typeof import("@/components/ui/alert-dialog")>(
  "@/components/ui/alert-dialog"
);
  return {
    ...actual,
    AlertDialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    AlertDialogCancel: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
    AlertDialogAction: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
      <button onClick={onClick}>{children}</button>
    ),
  };
});

describe("TodoItem", () => {
  const mockTodo: Todo = {
    id: 1,
    title: "Test Todo",
    description: "Test description",
    completed: false,
    createdAt: new Date().toISOString(),
    deadline_at: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    priority: "medium",
  };

  it("renders todo title and description", () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText("Test Todo")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders deadline correctly", () => {
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText(/Tomorrow at/)).toBeInTheDocument();
  });

  it("calls onToggle when checkbox clicked", async () => {
    const onToggle = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={onToggle} onDelete={vi.fn()} />);
    const checkbox = screen.getByRole("button", { name: "Đánh dấu là đã hoàn thành" });
    fireEvent.click(checkbox);
    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledWith(mockTodo.id);
    });
  });

  it("calls onDelete when delete confirmed", async () => {
    const onDelete = vi.fn();
    render(<TodoItem todo={mockTodo} onToggle={vi.fn()} onDelete={onDelete} />);
    const deleteButton = screen.getByLabelText("Xoá công việc");
    fireEvent.click(deleteButton);
    const confirmButton = screen.getByText("Xóa");
    fireEvent.click(confirmButton);
    expect(onDelete).toHaveBeenCalledWith(mockTodo.id);
  });
});
