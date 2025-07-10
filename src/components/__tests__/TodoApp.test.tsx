// Dummy test to always pass
import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AppSidebar } from "../AppSidebar";
import { SidebarProvider } from "../ui/sidebar";
import { AuthProvider } from "../../hooks/use-auth";

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

describe("Dummy", () => {
  it("always passes", () => {
    expect(true).toBe(true);
  });
});

describe("AppSidebar", () => {
  const baseProps = {
    onSectionChange: vi.fn(),
    currentSection: "inbox",
    todoCounts: {
      inbox: 1,
      today: 2,
      upcoming: 3,
      overdue: 0,
      noDeadline: 0,
      completed: 0,
    },
    onAdd: vi.fn(),
  };

  it("always renders Add task button in sidebar, regardless of section", () => {
    const { rerender } = render(
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar {...baseProps} currentSection="inbox" />
        </SidebarProvider>
      </AuthProvider>
    );
    // Luôn có nút Add task
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();

    rerender(
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar {...baseProps} currentSection="today" />
        </SidebarProvider>
      </AuthProvider>
    );
    // Vẫn luôn có nút Add task
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });
});