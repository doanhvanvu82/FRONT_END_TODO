import { useState } from "react";
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
} from "lucide-react";


interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    description?: string,
        priority?: "low" | "medium" | "high" | "none", 
    deadlineAt?: string
  ) => void;
}

const AddTodoModal = ({ isOpen, onClose, onAdd }: AddTodoModalProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "none">(
    "none"
  );
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(
        title.trim(),
        description.trim() || undefined,
        priority,
        deadline || undefined
      );
      setTitle("");
      setDescription("");
      setPriority("none");
      setDeadline("");
      onClose();
    }
  };

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
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
              className="focus:outline-none focus:ring-0 focus-visible:ring-0"
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

          <div>
            <Label htmlFor="deadline">Due date</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="focus:outline-none focus:ring-0 focus-visible:ring-0"
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
