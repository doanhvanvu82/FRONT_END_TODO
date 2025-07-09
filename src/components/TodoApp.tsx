import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import MainContent from "./MainContainer";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTodos as apiGetTodos, addTodo as apiAddTodo, updateTodo as apiUpdateTodo, deleteTodo as apiDeleteTodo } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt?: string;
  completedAt?: string;
  deadline_at?: string;
  priority?: "low" | "medium" | "high";
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState("inbox");
  const { toast } = useToast();
  const { token } = useAuth();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!token) throw new Error("Bạn chưa đăng nhập");
      const res = await apiGetTodos();
      if (!Array.isArray(res)) throw new Error("Lỗi lấy todo");
      setTodos(
        (res as unknown[]).map((todo: any) => ({
          id: todo.id,
          title: todo.title,
          description: todo.description,
          completed: todo.completed,
          createdAt: todo.created_at,
          completedAt: todo.completed_at,
          deadline_at: todo.deadline_at,
          priority: todo.priority as "low" | "medium" | "high",
        }))
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to fetch todos. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to fetch todos. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, token]);

  const addTodo = async (
    title: string,
    description?: string,
    priority: "low" | "medium" | "high" = "medium",
    deadline_at?: string
  ) => {
    try {
      if (!token) throw new Error("Bạn chưa đăng nhập");
      const res = await apiAddTodo({ title, description, priority, deadline_at });
      setTodos((prev) => [
        {
          id: res.id,
          title: res.title,
          description: res.description,
          completed: res.completed,
          createdAt: res.created_at,
          completedAt: res.completed_at,
          deadline_at: res.deadline_at,
          priority: res.priority as "low" | "medium" | "high",
        },
        ...prev,
      ]);
      toast({
        title: "Success",
        description: "Todo added successfully!",
      });
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add todo. Please try again.",
      });
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      if (!token) throw new Error("Bạn chưa đăng nhập");
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;
      const res = await apiUpdateTodo(id, { completed: !todoToUpdate.completed });
      // res là 1 todo object
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id
            ? {
                id: res.id,
                title: res.title,
                description: res.description,
                completed: res.completed,
                createdAt: res.created_at,
                completedAt: res.completed_at,
                deadline_at: res.deadline_at,
                priority: res.priority as "low" | "medium" | "high",
              }
            : todo
        )
      );
      toast({
        title: todoToUpdate.completed
          ? "Đã đánh dấu là chưa hoàn thành"
          : "Hoàn thành công việc!",
        description: todoToUpdate.completed
          ? "Tiếp tục cố gắng nhé!"
          : "Xuất sắc! 🎉",
      });
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Không thể cập nhật công việc. Vui lòng thử lại.",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      if (!token) throw new Error("Bạn chưa đăng nhập");
      const res = await apiDeleteTodo(id);
      if (!res.success) throw new Error(res.message || "Lỗi xoá todo");
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast({
        title: "Đã xoá công việc",
        description: "Công việc đã được xoá thành công.",
      });
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Không thể xoá công việc. Vui lòng thử lại.",
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
      if (todo.completed || !todo.deadline_at) return false;
      const deadline = new Date(todo.deadline_at);
      return deadline < today;
    }).length,
    today: todos.filter((todo) => {
      if (todo.completed || !todo.deadline_at) return false;
      const deadline = new Date(todo.deadline_at);
      return deadline >= today && deadline < tomorrow;
    }).length,
    upcoming: todos.filter((todo) => {
      if (todo.completed || !todo.deadline_at) return false;
      const deadline = new Date(todo.deadline_at);
      return deadline >= tomorrow;
    }).length,
    noDeadline: todos.filter((todo) => !todo.completed && !todo.deadline_at)
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
