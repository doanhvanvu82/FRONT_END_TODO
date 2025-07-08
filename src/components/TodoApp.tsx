import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";
import { Dialog, DialogTrigger, DialogContent } from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { request } from "@/lib/utils";

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

const API_URL = "/";

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const todos = await request<Todo[]>(API_URL);
      setTodos(
        todos.map((todo) => ({
          ...todo,
          priority: todo.priority as "low" | "medium" | "high",
        }))
      );
    } catch (err: any) {
      setError("Failed to fetch todos. Please try again.");
      console.error("Error fetching todos:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to fetch todos. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Add new todo
  const addTodo = async (
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    deadlineAt?: string
  ) => {
    try {
      const newTodo = await request<Todo>(API_URL, {
        method: "POST",
        body: JSON.stringify({ title, description, priority, deadlineAt }),
      });
      setTodos((prev) => [newTodo, ...prev]);
      toast({
        title: "Success",
        description: "Todo added successfully!",
      });
    } catch (err: any) {
      console.error("Error adding todo:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to add todo. Please try again.",
      });
    }
  };

  const toggleTodo = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;
      const updatedTodo = await request<Todo>(`/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...todoToUpdate,
          completed: !todoToUpdate.completed,
          completedAt: !todoToUpdate.completed ? new Date().toISOString() : null,
        }),
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );
      toast({
        title: todoToUpdate.completed
          ? "Todo marked as incomplete"
          : "Todo completed!",
        description: todoToUpdate.completed ? "Keep going!" : "Great job! 🎉",
      });
    } catch (err: any) {
      console.error("Error toggling todo:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to update todo. Please try again.",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await request<null>(`/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      toast({
        title: "Todo deleted",
        description: "Todo has been removed successfully.",
      });
    } catch (err: any) {
      console.error("Error deleting todo:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to delete todo. Please try again.",
      });
    }
  };

  const handleAddTodo = async (
    title: string,
    description?: string,
    priority: "low" | "medium" | "high" = "medium",
    deadlineAt?: string
  ) => {
    await addTodo(title, description, priority, deadlineAt);
    setOpen(false);
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

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sortedTodos = [...todos].sort((a, b) => {
    // 1. Chưa hoàn thành lên trên
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    // 2. Ưu tiên (high > medium > low)
    const pa = priorityOrder[a.priority || 'medium'] ?? 1;
    const pb = priorityOrder[b.priority || 'medium'] ?? 1;
    if (pa !== pb) return pa - pb;
    // 3. Deadline gần nhất lên trên (nếu có)
    if (a.deadlineAt && b.deadlineAt) {
      const da = new Date(a.deadlineAt).getTime();
      const db = new Date(b.deadlineAt).getTime();
      if (da !== db) return da - db;
    } else if (a.deadlineAt) {
      return -1;
    } else if (b.deadlineAt) {
      return 1;
    }
    // 4. Còn lại theo id giảm dần
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
   
        {/* Add Todo Section */}
        <div className="mb-8">
          <AddTodo onAdd={addTodo} />
        </div>

        {/* Tasks Overview */}
        {totalCount > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <span className="text-blue-500">My Tasks</span>
              </h2>
              <div className="text-right">
                <div className="text-xl font-bold text-gray-800">{completedCount}/{totalCount}</div>
                <div className="text-sm text-gray-500">completed</div>
              </div>
            </div>
            <div className="space-y-2">
              {sortedTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {totalCount === 0 && !loading && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-16 text-center">
            <div className="text-8xl mb-6 opacity-50">📝</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              Ready to be productive?
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              Create your first task and start organizing your life!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
