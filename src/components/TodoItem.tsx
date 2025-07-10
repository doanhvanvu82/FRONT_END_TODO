import { Check, Trash2, Calendar, MoreHorizontal, Loader2 } from "lucide-react";
import { Todo } from "./TodoApp";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const getBorderColorClass = (priority?: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "border-green-500";
    case "medium":
      return "border-yellow-500";
    case "high":
      return "border-red-500";
    default:
      return "border-gray-400";
  }
};

const getColorClass = (priority?: "low" | "medium" | "high") => {
  switch (priority) {
    case "low":
      return "bg-green-500 hover:bg-green-600";
    case "medium":
      return "bg-yellow-500 hover:bg-yellow-600";
    case "high":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  const [isTicking, setIsTicking] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(
      dateString.length === 19 ? dateString + "Z" : dateString
    );
    const now = new Date();

    const isSameDay = (d1: Date, d2: Date) =>
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();

    const isTomorrow = (d: Date) => {
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      return isSameDay(d, tomorrow);
    };

    const isYesterday = (d: Date) => {
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      return isSameDay(d, yesterday);
    };

    const getWeekNumber = (d: Date) => {
      const oneJan = new Date(d.getFullYear(), 0, 1);
      const numberOfDays = Math.floor(
        (d.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
      );
      return Math.ceil((d.getDay() + 1 + numberOfDays) / 7);
    };

    const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
    const timeString = date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const nowWeek = getWeekNumber(now);
    const dateWeek = getWeekNumber(date);
    const sameWeek =
      nowWeek === dateWeek && date.getFullYear() === now.getFullYear();

    if (isSameDay(date, now)) return `Today at ${timeString}`;
    if (isTomorrow(date)) return `Tomorrow at ${timeString}`;
    if (isYesterday(date)) return `Yesterday at ${timeString}`;
    if (sameWeek) return `${dayOfWeek} at ${timeString}`;

    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })} at ${timeString}`;
  };

  const isOverdue =
    todo.deadline_at &&
    new Date(todo.deadline_at) < new Date() &&
    !todo.completed;

  return (
    <div className={`border-b last:border-none border-gray-200/60 py-2 px-1 group hover:bg-gray-50/50 transition-colors duration-200 ${todo.completed ? 'transition-all duration-500' : ''}`}>
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        <button
          onClick={async () => {
            if (todo.completed) {
              await onToggle(todo.id);
            } else {
              setIsTicking(true);
              setTimeout(async () => {
                setIsTicking(false);
                await onToggle(todo.id);
              }, 800);
            }
          }}
          className={`w-[14px] h-[14px] mt-1 border-2 rounded-sm flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-sm ${
            todo.completed
              ? `${getColorClass(todo.priority)} ${getBorderColorClass(
                  todo.priority
                )} text-white shadow-md`
              : `${getBorderColorClass(
                  todo.priority
                )} hover:border-opacity-80 hover:shadow-md bg-white`
          }`}
          aria-label="Mark as completed"
        >
          <Check
            size={10}
            strokeWidth={3}
            className={`transition-all duration-400 ${
              todo.completed || isTicking
                ? "opacity-100 transform scale-100 rotate-0"
                : "opacity-0 transform scale-0 -rotate-90"
            }`}
          />
        </button>
        {/* Content */}
        <div className="flex-1 min-w-1">
          <div className={`text-sm break-words leading-5 transition-all duration-500 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}> 
            <span>{todo.title}</span>
          </div>
          {todo.description && (
            <p className={`text-xs mt-0.5 leading-4 break-words transition-all duration-500 ${todo.completed ? 'text-gray-300 line-through' : 'text-gray-600'}`}>{todo.description}</p>
          )}
          {todo.deadline_at && (
            <div className={`mt-1 flex items-center gap-1 text-[11px] transition-colors duration-200 ${isOverdue ? "text-red-600" : "text-gray-400"}`}>
              <Calendar size={12} />
              <span>{formatDate(todo.deadline_at)}</span>
            </div>
          )}
        </div>
        {/* Enhanced Actions with smooth transitions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button aria-label="Xoá công việc" className="p-1 hover:bg-red-50 rounded transition-all duration-150 transform hover:scale-110">
                <Trash2 
                  size={14}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-150"
                />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Xóa công việc</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc muốn xóa "{todo.title}" không?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Hủy</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(todo.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Xóa
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export function TodoItemSkeleton() {
  return (
    <div className="border-b last:border-none border-gray-200/60 py-2 px-1 group">
      <div className="flex items-start gap-2">
        {/* Checkbox skeleton */}
        <Skeleton className="w-[14px] h-[14px] mt-1 rounded-sm" />
        {/* Content skeleton */}
        <div className="flex-1 min-w-1">
          <Skeleton className="h-4 w-1/2 mb-2 rounded" />
          <Skeleton className="h-3 w-1/3 mb-1 rounded" />
          <Skeleton className="h-3 w-1/4 rounded" />
        </div>
        {/* Actions skeleton */}
        <div className="flex items-center gap-1 opacity-50">
          <Skeleton className="w-6 h-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default TodoItem;