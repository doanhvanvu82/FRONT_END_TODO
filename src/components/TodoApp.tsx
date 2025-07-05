import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

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
            title: "Học React Hooks",
            description: "Tìm hiểu useState, useEffect, và custom hooks",
            completed: false,
            createdAt: "2024-07-04T12:00:00.000Z",
            deadlineAt: "2024-07-06T18:00:00.000Z",
            completedAt: null,
            priority: "high",
          },
          {
            id: 2,
            title: "Viết unit test với Jest",
            description: "Viết ít nhất 3 bài test cho component TodoList",
            completed: true,
            createdAt: "2024-07-03T08:30:00.000Z",
            completedAt: "2024-07-04T10:15:00.000Z",
            deadlineAt: "2024-07-04T12:00:00.000Z",
            priority: "medium",
          },
          {
            id: 3,
            title: "Thiết kế giao diện responsive",
            description: "Sử dụng Tailwind CSS để tạo layout responsive",
            completed: false,
            createdAt: "2024-07-02T14:20:00.000Z",
            deadlineAt: "2024-07-08T17:00:00.000Z",
            completedAt: null,
            priority: "low",
          },
        ],
        message: "Lấy danh sách to-do thành công",
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


  // Add new todo
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
        deadlineAt
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

      console.log("Todo toggled:", id);

      toast({
        title: todoToUpdate.completed
          ? "Todo marked as incomplete"
          : "Todo completed!",
        description: todoToUpdate.completed ? "Keep going!" : "Great job! 🎉",
      });
    } catch (err) {
      console.error("Error toggling todo:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update todo. Please try again.",
      });
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      console.log("Todo deleted:", id);

      toast({
        title: "Todo deleted",
        description: "Todo has been removed successfully.",
      });
    } catch (err) {
      console.error("Error deleting todo:", err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete todo. Please try again.",
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

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
   
        {/* Add Todo Section */}
        <div className="mb-8">
          <AddTodo onAdd={addTodo} />
        </div>

        {/* Tasks Overview */}
        {totalCount > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{totalCount}</span>
                </div>
                Your Tasks
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{completedCount}/{totalCount}</div>
                <div className="text-sm text-gray-500">completed</div>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative mb-8">
              <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                <div
                  className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-700 ease-out shadow-lg relative overflow-hidden"
                  style={{
                    width: `${
                      totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                    }%`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded-full shadow-sm border">
                {Math.round((completedCount / totalCount) * 100) || 0}%
              </div>
            </div>

            {/* Todo List */}
            <div className="space-y-4">
              {todos.map((todo) => (
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
