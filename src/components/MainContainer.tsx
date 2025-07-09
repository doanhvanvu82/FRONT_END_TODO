import { useState, useRef } from "react";
import { Plus, MoreHorizontal, List } from "lucide-react";
import { Todo } from "./TodoApp";
import TodoItem from "./TodoItem";
import InlineAddTask from "./InlineAddTask";
import { Button } from "@/components/ui/button";
import React from "react";

interface MainContentProps {
  currentSection: string;
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onAdd: (
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    deadline_at?: string
  ) => void;
}

const MainContent = ({
  currentSection,
  todos,
  onToggle,
  onDelete,
  onAdd,
}: MainContentProps) => {
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  // Xóa toàn bộ state và logic liên quan đến pendingRemove, handleToggle, removeTimeouts
  // Trả lại onToggle gốc cho TodoItem

  const getSectionTitle = () => {
    switch (currentSection) {
      case "inbox":
        return "Inbox";
      case "today":
        return "Today";
      case "upcoming":
        return "Upcoming";
      case "completed":
        return "Completed";
      case "overdue":
        return "Overdue";
      case "nodeadline":
        return "No Deadline";
      default:
        return "Inbox";
    }
  };

  const getSectionDescription = () => {
    switch (currentSection) {
      case "inbox":
        return "Inbox is your go-to spot for quick task entry. Clear your mind now, organize when you're ready.";
      case "today":
        return "Focus on what needs to be done today.";
      case "upcoming":
        return "Plan ahead with your upcoming tasks.";
      case "completed":
        return "Review your completed tasks.";
      case "overdue":
        return "These tasks have missed their deadlines. Prioritize them now!";
      case "nodeadline":
        return "These tasks have no deadline. Set one to manage them better.";
      default:
        return "Inbox is your go-to spot for quick task entry. Clear your mind now, organize when you're ready.";
    }
  };

  const getFilteredTodos = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (currentSection) {
      case "today":
        return todos.filter((todo) => {
          if (todo.completed || !todo.deadline_at) return false;
          const deadline = new Date(todo.deadline_at);
          return deadline >= today && deadline < tomorrow;
        });
      case "upcoming":
        return todos.filter((todo) => {
          if (todo.completed || !todo.deadline_at) return false;
          const deadline = new Date(todo.deadline_at);
          return deadline >= tomorrow;
        });
      case "overdue":
        return todos.filter((todo) => {
          if (todo.completed || !todo.deadline_at) return false;
          const deadline = new Date(todo.deadline_at);
          return deadline < today;
        });
      case "nodeadline":
        return todos.filter((todo) => !todo.completed && !todo.deadline_at);
      case "completed":
        return todos.filter((todo) => todo.completed);
      case "inbox":
      default:
        return todos.filter((todo) => !todo.completed);
    }
  };

  const filteredTodos = getFilteredTodos();
  const handleInlineAdd = (
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    deadline_at?: string
  ) => {
    onAdd(title, description, priority, deadline_at);
  };

  return (
    <div className="flex-1 bg-white">
      {/* Header */}
      <div className=" border-gray-200 px-40 py-2 mt-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {getSectionTitle()}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-40 pb-40">
      {filteredTodos.length === 0 ? (
        currentSection === "inbox" ? (
          showInlineAdd ? (
            <InlineAddTask
              onAdd={handleInlineAdd}
              onCancel={() => setShowInlineAdd(false)}
            />
          ) : (
            <div className="text-center py-16">
              {/* Giao diện minh họa */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 rounded-2xl flex items-center justify-center">
                <div className="w-16 h-12 bg-yellow-500 rounded-lg relative">
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-600 rounded-full"></div>
                  <div className="absolute -top-2 -left-2 w-3 h-6 bg-green-400 rounded-full transform rotate-12"></div>
                  <div className="absolute -bottom-2 -right-2 w-3 h-6 bg-green-400 rounded-full transform -rotate-12"></div>
                  <div className="absolute -top-1 right-4 w-2 h-2 bg-yellow-300 rounded-full"></div>
                  <div className="absolute -bottom-1 left-2 w-2 h-2 bg-yellow-300 rounded-full"></div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Capture now, plan later
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {getSectionDescription()}
              </p>

              <Button
                onClick={() => setShowInlineAdd(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add task
              </Button>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentSection === "completed"
                ? "No completed tasks yet"
                : "No tasks in this section"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {currentSection === "completed"
                ? "Complete some tasks to see them here."
                : getSectionDescription()}
            </p>
          </div>
        )
      ) : (
        <div>
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}

          {currentSection === "inbox" && (showInlineAdd ? (
            <InlineAddTask
              onAdd={handleInlineAdd}
              onCancel={() => setShowInlineAdd(false)}
            />
          ) : (
            <button
              onClick={() => setShowInlineAdd(true)}
              className="group w-full text-left px-4 py-3 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center gap-3"
            >
              <div
                className="w-5 h-5 flex items-center justify-center rounded-full transition-all group-hover:bg-red-500"
              >
                <Plus
                  className="w-6 h-6 text-red-600 transition-all group-hover:text-white"
                  strokeWidth={1}
                />
              </div>
              <span className="text-sm">Add task</span>
            </button>
          ))}
        </div>
      )}
      </div>
    </div>
  );
};
export default MainContent;
