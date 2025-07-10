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

// Định nghĩa type cho dữ liệu trả về từ API
type ApiTodo = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
  completed_at?: string;
  deadline_at?: string;
  priority?: "low" | "medium" | "high";
};

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
      if (!token) throw new Error("You are not logged in");
      const res = await apiGetTodos();
      if (!Array.isArray(res)) throw new Error("Error fetching todos");
      setTodos(
        (res as ApiTodo[]).map((todo) => ({
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
    if (!token) return;
    // Tạo todo tạm thời với id âm để tránh trùng id backend
    const tempId = Date.now() * -1;
    const optimisticTodo: Todo = {
      id: tempId,
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: undefined,
      deadline_at,
      priority,
    };
    setTodos((prev) => [optimisticTodo, ...prev]);
    try {
      const res = await apiAddTodo({ title, description, priority, deadline_at });
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === tempId
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
        title: "Success",
        description: "Todo added successfully!",
      });
    } catch (err: unknown) {
      // Rollback: xóa todo tạm thời
      setTodos((prev) => prev.filter((todo) => todo.id !== tempId));
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to add todo. Please try again.",
      });
    }
  };

  const toggleTodo = async (id: number) => {
    if (!token) return;
    const todoToUpdate = todos.find((todo) => todo.id === id);
    if (!todoToUpdate) return;
    // Optimistic update
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
    try {
      const res = await apiUpdateTodo(id, { completed: !todoToUpdate.completed });
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
          ? "Marked as incomplete"
          : "Task completed!",
        description: todoToUpdate.completed
          ? "Keep trying your best!"
          : "Excellent! 🎉",
      });
    } catch (err: unknown) {
      // Rollback
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? { ...todo, completed: todoToUpdate.completed } : todo
        )
      );
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Unable to update task. Please try again.",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    if (!token) return;
    const prevTodos = todos;
    // Optimistic update
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    try {
      const res = await apiDeleteTodo(id);
      if (!res.success) throw new Error(res.message || "Error deleting todo");
              toast({
          title: "Todo deleted",
          description: "Todo has been deleted successfully.",
        });
    } catch (err: unknown) {
      // Rollback
      setTodos(prevTodos);
              toast({
          variant: "destructive",
          title: "Error",
          description: err instanceof Error ? err.message : "Unable to delete todo. Please try again.",
        });
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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
            loading={loading}
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TodoApp;
