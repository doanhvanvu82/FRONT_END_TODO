import { useState } from "react";
import { Plus } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [deadlineAt, setDeadlineAt] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(
        title.trim(),
        description.trim() || undefined,
        priority,
        deadlineAt ? new Date(deadlineAt).toISOString() : undefined
      );

      setTitle("");
      setDescription("");
      setPriority("medium"); // reset về mặc định
      setDeadlineAt(""); // reset input ngày giờ
      console.log("Todo submitted:", title.trim(), description.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What do you need to do?"
        className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
        disabled={isSubmitting}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Additional details (optional)"
        className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors duration-200"
        disabled={isSubmitting}
      />

      <div className="flex gap-3">
        {["low", "medium", "high"].map((level) => {
          const isActive = priority === level;
          const color =
            level === "low"
              ? "bg-green-200 text-green-800"
              : level === "medium"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-red-200 text-red-800";

          const border = isActive
            ? "ring-2 ring-offset-2 ring-blue-500"
            : "border";

          return (
            <button
              key={level}
              type="button"
              onClick={() => setPriority(level as "low" | "medium" | "high")}
              className={`px-4 py-2 rounded-lg ${color} ${border} transition-all`}
              disabled={isSubmitting}
            >
              {level === "low" && "🔵 Low"}
              {level === "medium" && "🟠 Medium"}
              {level === "high" && "🔴 High"}
            </button>
          );
        })}
      </div>

      <input
        type="datetime-local"
        value={deadlineAt}
        onChange={(e) => setDeadlineAt(e.target.value)}
        className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
        disabled={isSubmitting}
      />

      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium self-start"
      >
        <Plus size={20} />
        {isSubmitting ? "Adding..." : "Add"}
      </button>
    </form>
  );
};

export default AddTodo;
