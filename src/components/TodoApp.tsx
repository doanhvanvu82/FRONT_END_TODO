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
  completedAt?: string;
  deadlineAt?: string;
  priority: string;
}

const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch todos from backend
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data matching provided JSON
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

      setTodos(mockResponse.data);
      console.log("Todos fetched successfully:", mockResponse.data);
    } catch (err) {
      setError("Không thể tải danh sách công việc. Vui lòng thử lại.");
      console.error("Error fetching todos:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách công việc. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async (title: string, description?: string, priority: string = "medium", deadlineAt?: string) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newTodo: Todo = {
        id: Date.now(),
        title,
        description,
        completed: false,
        createdAt: new Date().toISOString(),
        deadlineAt,
        priority,
      };

      setTodos((prev) => [newTodo, ...prev]);
      console.log("Todo added:", newTodo);

      toast({
        title: "Thành công",
        description: "Công việc đã được thêm thành công!",
      });
    } catch (err) {
      console.error("Error adding todo:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm công việc. Vui lòng thử lại.",
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
        completedAt: !todoToUpdate.completed ? new Date().toISOString() : undefined,
      };

      setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));

      console.log("Todo toggled:", id);

      toast({
        title: todoToUpdate.completed ? "Công việc được đánh dấu chưa hoàn thành" : "Công việc hoàn thành!",
        description: todoToUpdate.completed ? "Tiếp tục cố gắng!" : "Tuyệt vời! 🎉",
      });
    } catch (err) {
      console.error("Error toggling todo:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật công việc. Vui lòng thử lại.",
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
        title: "Công việc đã xóa",
        description: "Công việc đã được xóa thành công.",
      });
    } catch (err) {
      console.error("Error deleting todo:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa công việc. Vui lòng thử lại.",
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
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <AddTodo onAdd={addTodo} />
      </div>

      {totalCount > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Danh sách công việc</h2>
            <div className="text-sm text-gray-500">
              {completedCount} / {totalCount} hoàn thành
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
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
            Chưa có công việc nào
          </h3>
          <p className="text-gray-500">
            Thêm công việc đầu tiên ở trên để bắt đầu!
          </p>
        </div>
      )}
    </div>
  );
};

export default TodoApp;