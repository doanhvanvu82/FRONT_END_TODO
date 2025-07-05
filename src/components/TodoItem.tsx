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
      minute: '2-digit'
    });
  };

  const getPriorityStyles = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-700 border border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
      todo.completed 
        ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-md shadow-green-100' 
        : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100'
    }`}>
      {/* Priority indicator bar */}
      {todo.priority && (
        <div className={`absolute top-0 left-0 right-0 h-1 ${
          todo.priority === 'high' ? 'bg-gradient-to-r from-red-400 to-red-500' :
          todo.priority === 'medium' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
          'bg-gradient-to-r from-green-400 to-green-500'
        }`} />
      )}
      
      <div className="flex items-start p-6 pt-7">
        <button
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-300 mt-1 shadow-sm ${
            todo.completed
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg shadow-green-200'
              : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md'
          }`}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && <Check size={16} className="font-bold" />}
        </button>

        <div className="flex-1 ml-5">
          <div className="flex items-center gap-3 mb-2">
            <h3 className={`font-bold text-lg transition-all duration-200 ${
              todo.completed 
                ? 'text-gray-500 line-through' 
                : 'text-gray-800'
            }`}>
              {todo.title}
            </h3>
            
            {todo.priority && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityStyles(todo.priority)}`}>
                {todo.priority === 'high' && '🔴 Ưu tiên cao'}
                {todo.priority === 'medium' && '🟡 Trung bình'}
                {todo.priority === 'low' && '🟢 Thấp'}
              </span>
            )}
          </div>
          
          {todo.description && (
            <p className={`text-sm leading-relaxed mb-4 transition-all duration-200 ${
              todo.completed 
                ? 'text-gray-400 line-through' 
                : 'text-gray-600'
            }`}>
              {todo.description}
            </p>
          )}

          {/* Enhanced date display */}
          <div className="flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 text-xs font-medium">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              Tạo: {formatDate(todo.createdAt)}
            </div>
            
            {todo.deadlineAt && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 text-xs font-medium">
                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                Hạn: {formatDate(todo.deadlineAt)}
              </div>
            )}
            
            {todo.completed && todo.completedAt && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-200 text-xs font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Hoàn thành: {formatDate(todo.completedAt)}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => onDelete(todo.id)}
          className="flex-shrink-0 p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 shadow-sm hover:shadow-md"
          aria-label="Delete todo"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TodoItem;