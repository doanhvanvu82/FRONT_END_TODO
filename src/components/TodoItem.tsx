import React from "react";
import { Check, Trash2, Calendar, Clock, CheckCircle2 } from 'lucide-react';
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
    <div
      className={`flex flex-col bg-white rounded-lg px-3 py-2 mb-1 shadow border border-gray-100 transition-all duration-200 hover:shadow-md group relative ${
        todo.completed ? "opacity-60" : ""
      }`}
      style={{ minHeight: 44 }}
    >
      <div className="flex items-center w-full gap-2">
        <button
          onClick={() => onToggle(todo.id)}
          className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center mr-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
            todo.completed
              ? "bg-blue-500 border-blue-500"
              : "border-gray-300 bg-white hover:border-blue-400"
          }`}
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {todo.completed && (
            <Check size={14} className="text-white" strokeWidth={3} />
          )}
        </button>
        <span
          className={`flex-1 text-base font-medium transition-all duration-150 select-none flex items-center gap-2 truncate ${
            todo.completed ? "line-through text-gray-400" : "text-gray-800"
          }`}
        >
          {todo.title}
          {(todo.priority === 'high' || todo.priority === 'medium' || todo.priority === 'low') && (
            <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-semibold ${getPriorityStyles(todo.priority)}`}
              style={{fontSize: '11px'}}>
              {todo.priority === 'high' && 'High'}
              {todo.priority === 'medium' && 'Medium'}
              {todo.priority === 'low' && 'Low'}
            </span>
          )}
        </span>
        <button
          onClick={() => onDelete(todo.id)}
          className="ml-2 text-gray-300 hover:text-red-500 transition-colors duration-150 opacity-0 group-hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
      {todo.description && (
        <div className="ml-7 mt-0.5 text-gray-500 text-xs whitespace-pre-line truncate">
          {todo.description}
        </div>
      )}
      {(todo.deadlineAt || todo.createdAt || todo.completedAt) && (
        <div className="absolute right-2 bottom-1 flex items-center gap-2 text-gray-400 text-[11px]">
          {todo.deadlineAt && (
            <span className="flex items-center gap-1" title="Hạn chót">
              <Calendar size={12} className="-mt-0.5" />
              {formatDate(todo.deadlineAt)}
            </span>
          )}
          {todo.createdAt && (
            <span className="flex items-center gap-1" title="Ngày tạo">
              <Clock size={12} className="-mt-0.5" />
              {formatDate(todo.createdAt)}
            </span>
          )}
          {todo.completedAt && todo.completed && (
            <span className="flex items-center gap-1 text-green-500" title="Hoàn thành lúc">
              <CheckCircle2 size={12} className="-mt-0.5" />
              {formatDate(todo.completedAt)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TodoItem;