
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import MainContent from "./MainContainer";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { SidebarTrigger } from "@/components/ui/sidebar";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  completedAt?: string;
  deadlineAt?: string;
  priority?: "low" | "medium" | "high";
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState("inbox");
  const { toast } = useToast();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockResponse = {
        success: true,
        data: [
          {
            id: 1,
            title: "Learn React Hooks",
            description: "Study useState, useEffect, and custom hooks",
            completed: false,
            createdAt: "2024-07-04T12:00:00.000Z",
            deadlineAt: "2024-07-07T18:00:00.000Z",
            completedAt: null,
            priority: "high",
          },
          {
            id: 2,
            title: "Write unit tests with Jest",
            description: "Write at least 3 tests for TodoList component",
            completed: true,
            createdAt: "2024-07-03T08:30:00.000Z",
            completedAt: "2024-07-04T10:15:00.000Z",
            deadlineAt: "2024-07-04T12:00:00.000Z",
            priority: "medium",
          },
          {
            id: 3,
            title: "Design responsive interface",
            description: "Use Tailwind CSS to create responsive layout",
            completed: false,
            createdAt: "2024-07-02T14:20:00.000Z",
            deadlineAt: "2024-07-08T17:00:00.000Z",
            completedAt: null,
            priority: "low",
          },
          {
            id: 4,
            title: "Set up CI/CD pipeline",
            completed: false,
            createdAt: "2024-07-05T09:00:00.000Z",
            priority: "medium",
          },
          {
            id: 5,
            title: "Review pull requests",
            description: "Check and approve pending PRs from team members",
            completed: false,
            createdAt: "2024-07-05T14:30:00.000Z",
            deadlineAt: "2024-07-07T17:00:00.000Z",
            priority: "high",
          },
          {
            id: 6,
            title: "Update documentation",
            completed: true,
            createdAt: "2024-07-04T16:00:00.000Z",
            completedAt: "2024-07-05T11:30:00.000Z",
            priority: "low",
          },
        ],
        message: "Todo list fetched successfully",
      };

      setTodos(
        mockResponse.data.map((todo) => ({
          ...todo,
          priority: todo.priority as "low" | "medium" | "high",
        }))
      );
      console.log("Todos fetched successfully:", mockResponse.data);
    } catch (err) {
      setError("Failed to fetch todos. Please try again.");
      console.error("Error fetching todos:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch todos. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const addTodo = async (
    title: string,
    description?: string,
    priority: "low" | "medium" | "high" = "medium",
    deadlineAt?: string
  ) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTodo: Todo = {
        id: Date.now(),
        title,
        description,
        completed: false,
        createdAt: new Date().toISOString(),
        priority,
        deadlineAt,
      };

      setTodos((prev) => [newTodo, ...prev]);
      console.log("Todo added:", newTodo);

      toast({
        title: "Success",
        description: "Todo added successfully!",
      });
    } catch (err) {
      console.error("Error adding todo:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add todo. Please try again.",
      });
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;

      await new Promise((resolve) => setTimeout(resolve, 300));

      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
        completedAt: !todoToUpdate.completed
          ? new Date().toISOString()
          : undefined,
      };

      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );

      console.log("Đã cập nhật trạng thái công việc:", id);

      toast({
        title: todoToUpdate.completed
          ? "Đã đánh dấu là chưa hoàn thành"
          : "Hoàn thành công việc!",
        description: todoToUpdate.completed
          ? "Tiếp tục cố gắng nhé!"
          : "Xuất sắc! 🎉",
      });
    } catch (err) {
      console.error("Lỗi khi cập nhật công việc:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật công việc. Vui lòng thử lại.",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      console.log("Đã xoá công việc:", id);

      toast({
        title: "Đã xoá công việc",
        description: "Công việc đã được xoá thành công.",
      });
    } catch (err) {
      console.error("Lỗi khi xoá công việc:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xoá công việc. Vui lòng thử lại.",
      });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  if (loading && todos.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && todos.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchTodos} />;
  }

  // Calculate counts for sidebar
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todoCounts = {
    inbox: todos.filter((todo) => !todo.completed).length,
    overdue: todos.filter((todo) => {
      if (todo.completed || !todo.deadlineAt) return false;
      const deadline = new Date(todo.deadlineAt);
      return deadline < today;
    }).length,
    today: todos.filter((todo) => {
      if (todo.completed || !todo.deadlineAt) return false;
      const deadline = new Date(todo.deadlineAt);
      return deadline >= today && deadline < tomorrow;
    }).length,
    upcoming: todos.filter((todo) => {
      if (todo.completed || !todo.deadlineAt) return false;
      const deadline = new Date(todo.deadlineAt);
      return deadline >= tomorrow;
    }).length,
    noDeadline: todos.filter((todo) => !todo.completed && !todo.deadlineAt)
      .length,
    completed: todos.filter((todo) => todo.completed).length,
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
      {/* Global sidebar trigger - always visible */}
        <div className="fixed top-5 left-4 z-10">
          <SidebarTrigger className="h-8 w-8 " />
        </div>
        <AppSidebar 
          onSectionChange={setCurrentSection}
          currentSection={currentSection}
          todoCounts={todoCounts}
          onAdd={addTodo}
        />
        <div className="flex-1 flex flex-col">
          <MainContent
            currentSection={currentSection}
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onAdd={addTodo}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TodoApp;
