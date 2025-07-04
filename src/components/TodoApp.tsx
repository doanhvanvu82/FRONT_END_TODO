import { useState, useEffect } from "react";
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
  completedAt?: string | null;
  deadlineAt?: string;
  priority?: "low" | "medium" | "high";
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call for now - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data matching your format
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
        mockResponse.data.map((item) => ({
          ...item,
          priority: item.priority as "low" | "medium" | "high",
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
  };

  // Add new todo
  const addTodo = async (title: string, description?: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTodo: Todo = {
        id: Date.now(),
        title,
        description,
        completed: false,
        createdAt: new Date().toISOString(),
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

  // Toggle todo completion
  const toggleTodo = async (id: number) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;

      // Simulate API call
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

  // Delete todo
  const deleteTodo = async (id: number) => {
    try {
      // Simulate API call
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
  }, []);

  if (loading && todos.length === 0) {
    return <LoadingSpinner />;
  }

  if (error && todos.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchTodos} />;
  }

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <AddTodo onAdd={addTodo} />
      </div>

      {totalCount > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
            <div className="text-sm text-gray-500">
              {completedCount} of {totalCount} completed
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${
                  totalCount > 0 ? (completedCount / totalCount) * 100 : 0
                }%`,
              }}
            ></div>
          </div>

          <div className="space-y-3">
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

      {totalCount === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No todos yet
          </h3>
          <p className="text-gray-500">
            Add your first todo above to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoApp;
