import { useState, useRef, useEffect } from "react";
import {
  X,
  Flag,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Calendar as CalendarIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef } from "react";

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
}

const CustomDateInput = forwardRef<HTMLButtonElement, CustomInputProps>(
  ({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="flex items-center  h-[1.625rem] px-2 text-xs border border-gray-200 rounded text-gray-600 bg-white hover:bg-gray-50"
    >
      <CalendarIcon className="w-4 h-4 mr-1 text-gray-500" />
      <span>{value || "Date"}</span>
    </button>
  )
);

CustomDateInput.displayName = "CustomDateInput"; // 💡 Bắt buộc với forwardRef

interface InlineAddTaskProps {
  onAdd: (
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high" | "none", 
    deadline_at?: string
  ) => void;
  onCancel: () => void;
}

const getFlagColor = (
  priority: "low" | "medium" | "high" | "none" | undefined
) => {
  switch (priority) {
    case "low":
      return "text-green-500";
    case "medium":
      return "text-yellow-500";
    case "high":
      return "text-red-500";
    case "none":
    default:
      return "text-gray-400";
  }
};

const getLabel = (priority: string | undefined) => {
  switch (priority) {
    case "low":
      return "Low";
    case "medium":
      return "Medium";
    case "high":
      return "High";
    case "none":
    default:
      return "No priority";
  }
};

const InlineAddTask = ({ onAdd, onCancel }: InlineAddTaskProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "none">(
    "none"
  );
  const [deadline, setDeadline] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(
        title.trim(),
        description.trim() || undefined,
        priority === "none" ? null : priority,
        deadline || undefined
      );
      setTitle("");
      setDescription("");
      setPriority("none");
      setDeadline("");
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 shadow-sm mt-1">
      <form
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        className="w-full"
      >
        <Input
          ref={titleInputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task name"
          className="font-medium placeholder:text-gray-400 mt-1 h-8 px-0 py-0 placeholder:text-left text-sm border-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 focus:outline-none ring-0 ring-transparent"
        />

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="min-h-[6px] h-8 mb-0 placeholder:text-gray-400 text-[13px] px-0 py-0 placeholder:text-left focus:outline-none border-none focus:ring-0 focus:ring-transparent focus:ring-offset-0"
        />

        {/* ⬇️ Các nút Date, Priority, Reminders, More luôn hiện và đặt ngay dưới Description */}
        <div className="flex gap-2 mb-3">
          <div className="flex items-center h-7 text-xs text-gray-600">
            <DatePicker
              selected={deadline ? new Date(deadline) : null}
              onChange={(date: Date | null) => {
                if (date) setDeadline(date.toISOString());
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="Pp"
              customInput={<CustomDateInput />}
            />
          </div>

          <Select
            value={priority}
            onValueChange={(value: "low" | "medium" | "high" | undefined) =>
              setPriority(value)
            }
          >
            <SelectTrigger className="h-7 w-32 text-xs text-gray-600 focus:outline-none focus:ring-0 focus-visible:ring-0">
              <div className="flex items-center gap-2">
                <Flag className={`w-3 h-3 ${getFlagColor(priority)}`} />
                <span>{getLabel(priority)}</span>
              </div>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="none">
                <div className="flex items-center gap-2">
                  <Flag className="w-3 h-3 text-gray-400" />
                  <span>No priority</span>
                </div>
              </SelectItem>

              <SelectItem value="low">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 text-green-500" />
                    <span>Low</span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 text-yellow-500" />
                    <span>Medium</span>
                  </div>
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 text-red-500" />
                    <span>High</span>
                  </div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ⬇️ Đường kẻ dài hết chiều ngang */}
        <div className="-mx-4 border-t border-gray-200 my-2" />
        {/* ⬇️ Hành động */}
        <div className="flex justify-end gap-2 mb-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 px-3 text-[13px]  bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            className="h-8 px-3 text-[13px] bg-red-500 hover:bg-red-600"
            disabled={!title.trim()}
          >
            Add task
          </Button>
        </div>
      </form>
    </div>
  );
};

export default InlineAddTask;
