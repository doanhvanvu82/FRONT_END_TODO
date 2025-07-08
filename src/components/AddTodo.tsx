import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AddTodoProps {
  onAdd: (
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    deadlineAt?: string
  ) => void;
}

const AddTodo = ({ onAdd }: AddTodoProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | undefined>(undefined);
  const [deadlineAt, setDeadlineAt] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    try {
      await onAdd(
        title.trim(),
        description.trim() || undefined,
        priority || undefined,
        deadlineAt ? new Date(deadlineAt).toISOString() : undefined
      );
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDeadlineAt("");
      setShowMore(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow px-4 py-3 border border-gray-200 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a task..."
          className="flex-1 bg-transparent outline-none text-lg px-2"
          disabled={isSubmitting}
        />
        <button
          type="button"
          className="text-gray-400 hover:text-blue-500 p-1 rounded-full"
          onClick={() => setShowMore((v) => !v)}
          tabIndex={-1}
        >
          {showMore ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 font-semibold shadow transition-all disabled:opacity-50"
        >
          Add
        </button>
      </div>
      {showMore && (
        <div className="flex flex-col md:flex-row gap-2 mt-1">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base outline-none"
            disabled={isSubmitting}
          />
          <select
            value={priority || ""}
            onChange={(e) => setPriority(e.target.value ? e.target.value as "low" | "medium" | "high" : undefined)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base outline-none"
            disabled={isSubmitting}
          >
            <option value="">Không ưu tiên</option>
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="datetime-local"
            value={deadlineAt}
            onChange={(e) => setDeadlineAt(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-base outline-none"
            disabled={isSubmitting}
          />
        </div>
      )}
    </form>
  );
};

export default AddTodo;
