import { render, act } from "@testing-library/react";
import { screen, fireEvent } from "@testing-library/dom";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import TodoApp from "../TodoApp";

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe("TodoApp", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders loading state initially", () => {
    render(<TodoApp />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test("renders todos with correct fields", async () => {
    render(<TodoApp />);

    // Advance timers to simulate API call completion
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText("Học React Hooks")).toBeInTheDocument();
    expect(screen.getByText("Viết unit test với Jest")).toBeInTheDocument();
    expect(
      screen.getByText("Thiết kế giao diện responsive")
    ).toBeInTheDocument();

    // Check for priority badges
    // Check for priority badges (dùng getAllByText rồi kiểm tra số lượng)
    expect(screen.getAllByText(/Ưu tiên cao/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ưu tiên trung bình/i).length).toBeGreaterThan(
      0
    );
    expect(screen.getAllByText(/Ưu tiên thấp/i).length).toBeGreaterThan(0);

    // Check for date labels
    expect(screen.getAllByText(/Tạo:/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Hạn:/i).length).toBeGreaterThan(0);
  });

  test("allows toggling todo completion", async () => {
    render(<TodoApp />);

    // Advance timers to fetch todos
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const toggleButton = screen.getAllByRole("button", {
      name: /Mark as complete/i,
    })[0];

    await act(async () => {
      fireEvent.click(toggleButton);
      // Advance timers for toggle action
      vi.advanceTimersByTime(300);
    });

    expect(screen.getByText("Học React Hooks")).toHaveClass("line-through");
  });

  test("allows deleting a todo", async () => {
    render(<TodoApp />);

    // Advance timers to fetch todos
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    const deleteButtons = screen.getAllByRole("button", {
      name: /Delete todo/i,
    });

    await act(async () => {
      fireEvent.click(deleteButtons[0]);
      // Advance timers for delete action
      vi.advanceTimersByTime(300);
    });

    expect(screen.queryByText("Học React Hooks")).not.toBeInTheDocument();
  });
});
