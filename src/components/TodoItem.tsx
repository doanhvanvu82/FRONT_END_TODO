
import { Check, Trash2 } from 'lucide-react';
import { Todo } from './TodoApp';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div
      className={`group flex items-start p-4 rounded-lg border-2 transition-all duration-200 ${
        todo.completed
          ? 'bg-green-50 border-green-200'
          : 'bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
      }`}
    >
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-1 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        }`}
        aria-label={todo.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu hoàn thành'}
      >
        {todo.completed && <Check size={14} />}
      </button>

      <div className="flex-1 ml-4">
        <div className="flex items-center gap-2">
          <h3
            className={`font-medium transition-all duration-200 ${
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'
            }`}
          >
            {todo.title}
          </h3>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getPriorityStyles(
              todo.priority
            )}`}
          >
            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
          </span>
        </div>

        {todo.description && (
          <p
            className={`text-sm mt-1 transition-all duration-200 ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-600'
            }`}
          >
            {todo.description}
          </p>
        )}

        <div className="mt-2 text-xs space-y-1">
          <p className="text-gray-500">Tạo: {formatDate(todo.createdAt)}</p>
          {todo.deadlineAt && (
            <p
              className={`${
                new Date(todo.deadlineAt) < new Date()
                  ? 'text-red-500 font-medium'
                  : 'text-gray-500'
              }`}
            >
              Hạn chót: {formatDate(todo.deadlineAt)}
            </p>
          )}
          {todo.completed && todo.completedAt && (
            <p className="text-green-600 bg-green-100 px-2 py-1 rounded-full inline-block">
              Hoàn thành: {formatDate(todo.completedAt)}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
        aria-label="Xóa công việc"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TodoItem;
