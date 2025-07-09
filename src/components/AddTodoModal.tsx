import { useRef, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Flag,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { forwardRef } from "react";
import { getAISuggestions } from "@/lib/api";


interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    description?: string,
        priority?: "low" | "medium" | "high" | "none", 
    deadline_at?: string
  ) => void;
}

const AddTodoModal = ({ isOpen, onClose, onAdd }: AddTodoModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "none">(
    "none"
  );
  const [deadline, setDeadline] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

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
      onClose();
    }
  };

  const handleAISuggest = async () => {
    if (!title.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const suggestions = await getAISuggestions(title.trim());
      setAiSuggestions(suggestions);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAiError(err.message);
      } else {
        setAiError("Failed to get AI suggestions");
      }
    } finally {
      setAiLoading(false);
    }
  };

  const handleAIApprove = () => {
    if (aiSuggestions) {
      setDescription(aiSuggestions.join("\n"));
      setAiSuggestions(null);
    }
  };

  const handleAIReject = () => {
    setAiSuggestions(null);
    setAiError(null);
  };

  const handleAIDeleteItem = (idx: number) => {
    if (!aiSuggestions) return;
    setAiSuggestions(aiSuggestions.filter((_, i) => i !== idx));
  };

  const CustomDateInput = forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: () => void }
  >(({ value, onClick }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="w-full h-9 px-3 text-left text-sm border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:none transition flex items-center"
    >
      <CalendarIcon className="w-4 h-4 mr-2 text-gray-500" />
      <span className="truncate">{value || "Select date"}</span>
    </button>
  ));

  CustomDateInput.displayName = "CustomDateInput";

  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize description textarea when value changes
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "auto";
      descriptionRef.current.style.height = descriptionRef.current.scrollHeight + "px";
    }
  }, [description]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task name *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Buy groceries"
              className="focus:outline-none focus:ring-0 focus-visible:ring-0"
              required
            />
            <div className="flex gap-2 mt-2">
              <Button type="button" variant="secondary" onClick={handleAISuggest} disabled={aiLoading || !title.trim()}>
                {aiLoading ? "Suggesting..." : "Add with AI"}
              </Button>
            </div>
            {aiError && <div className="text-red-500 text-xs mt-1">{aiError}</div>}
            {aiSuggestions && (
              <div className="border rounded p-2 mt-2 bg-gray-50">
                <div className="font-semibold mb-1">AI Suggestions:</div>
                <ul className="mb-2">
                  {aiSuggestions.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-1">
                      <span>{item}</span>
                      <button type="button" className="text-xs text-red-500 hover:underline" onClick={() => handleAIDeleteItem(idx)}>Delete</button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleAIApprove}>
                    Approve
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={handleAIReject}>
                    Reject
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details..."
              ref={descriptionRef}
              rows={3}
              className="focus:outline-none focus:ring-0 focus-visible:ring-0 min-h-[80px] max-h-[300px]"
            />
          </div>

          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(value: "low" | "medium" | "high") =>
                setPriority(value)
              }
            >
              <SelectTrigger className="h-9 w-full text-sm text-gray-600 focus:outline-none focus:ring-0 focus-visible:ring-0">
                <div className="flex items-center gap-2">
                  <Flag
                    className={`w-4 h-4 ${
                      priority === "low"
                        ? "text-green-500"
                        : priority === "medium"
                        ? "text-yellow-500"
                        : priority === "high"
                        ? "text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                  <span>
                    {priority === "low"
                      ? "Low"
                      : priority === "medium"
                      ? "Medium"
                      : priority === "high"
                      ? "High"
                      : "Priority"}
                  </span>
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
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 text-green-500" />
                    <span>Low</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 text-yellow-500" />
                    <span>Medium</span>
                  </div>
                </SelectItem>
                <SelectItem value="high">
                  <div className="flex items-center gap-2">
                    <Flag className="w-3 h-3 text-red-500" />
                    <span>High</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-2">
            <Label htmlFor="deadline">Due date</Label>
            <DatePicker
              selected={deadline ? new Date(deadline) : null}
              onChange={(date: Date | null) => {
                if (date) setDeadline(date.toISOString());
              }}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              customInput={<CustomDateInput />}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-red-500 hover:bg-red-600">
              Add task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoModal;
