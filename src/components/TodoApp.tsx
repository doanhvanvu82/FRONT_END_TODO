import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import TodoItem from "./TodoItem";
import AddTodoModal from "./AddTodoModal";
import FloatingActionButton from "./FloatingActionButton";
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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
            deadlineAt: "2024-07-06T18:00:00.000Z",
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
      // Tìm công việc cần cập nhật
      const todoToUpdate = todos.find((todo) => todo.id === id);
      if (!todoToUpdate) return;

      // Giả lập thời gian xử lý
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Cập nhật trạng thái công việc
      const updatedTodo = {
        ...todoToUpdate,
        completed: !todoToUpdate.completed,
        completedAt: !todoToUpdate.completed
          ? new Date().toISOString()
          : undefined,
      };

      // Cập nhật vào danh sách công việc
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? updatedTodo : todo))
      );

      console.log("Đã cập nhật trạng thái công việc:", id);

      // Thông báo kết quả
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
      // Giả lập thời gian xử lý
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Cập nhật danh sách công việc (xoá công việc)
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      console.log("Đã xoá công việc:", id);

      // Thông báo thành công
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

  const completedCount = todos.filter((todo) => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Tasks Overview */}
        {totalCount > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {totalCount}
                  </span>
                </div>
                Công việc của bạn
              </h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">
                  {completedCount}/{totalCount}
                </div>
                <div className="text-sm text-gray-500">đã hoàn thành</div>
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
              Sẵn sàng để làm việc hiệu quả chưa?
            </h3>
            <p className="text-gray-500 text-lg mb-6">
              Nhấn nút dấu cộng để tạo công việc đầu tiên của bạn!
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      {/* Add Todo Modal */}
      <AddTodoModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={addTodo}
      />
    </div>
  );
};

export default TodoApp;