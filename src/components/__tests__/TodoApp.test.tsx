import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import TodoApp, { Todo } from "../TodoApp";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { ReactNode } from "react";

// Mock toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock Sidebar components
vi.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  SidebarTrigger: () => <button>SidebarTrigger</button>,
}));

// Mock AppSidebar with proper props
vi.mock("../AppSidebar", () => ({
  AppSidebar: ({
    onAdd,
  }: {
    onAdd: (title: string, description?: string, priority?: "low" | "medium" | "high") => void;
  }) => (
    <div>
      <button onClick={() => onAdd("Test Task", "Test Desc", "high")}>Add Todo</button>
    </div>
  ),
}));

// Mock MainContent with proper typing
vi.mock("../MainContainer", () => ({
  __esModule: true,
  default: ({
    todos,
    onToggle,
    onDelete,
  }: {
    todos: Todo[];
    onToggle: (id: number) => void;
    onDelete: (id: number) => void;
  }) => (
    <div>
      {todos.map((todo) => (
        <div key={todo.id}>
          <span>{todo.title}</span>
          <button onClick={() => onToggle(todo.id)}>Toggle</button>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  ),
}));

describe("TodoApp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });



  it("hiển thị todo sau khi fetch", async () => {
    render(<TodoApp />);
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("Learn React Hooks")).toBeInTheDocument();
    expect(screen.getByText("Design responsive interface")).toBeInTheDocument();
  });

 it("có thể toggle trạng thái completed", async () => {
  render(<TodoApp />);
  await act(async () => {
    vi.advanceTimersByTime(1000); // giả lập fetchTodos
  });

  const toggleButton = screen.getAllByText("Toggle")[0];


  fireEvent.click(toggleButton);

  await act(async () => {
    vi.advanceTimersByTime(1000); // delay trong toggle
  });

  expect(screen.getByText("Learn React Hooks")).toBeInTheDocument();
});


 
});
