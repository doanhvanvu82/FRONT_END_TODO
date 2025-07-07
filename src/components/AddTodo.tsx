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
      setPriority("medium");
      setDeadlineAt("");
      console.log("Todo submitted:", title.trim(), description.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl border border-blue-200/50 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <Plus size={18} className="text-white" />
        </div>
        Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Task Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What do you need to do?"
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 placeholder-gray-400 text-gray-800 shadow-sm"
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Description (Optional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about your task..."
            rows={3}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 placeholder-gray-400 text-gray-800 shadow-sm resize-none"
            disabled={isSubmitting}
          />
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Priority Level</label>
          <div className="flex gap-2 flex-wrap">
            {["low", "medium", "high"].map((level) => {
              const isActive = priority === level;
              const colors = {
                low: {
                  base: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200",
                  active: "bg-green-500 text-white border-green-500 shadow-lg shadow-green-200"
                },
                medium: {
                  base: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200",
                  active: "bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-200"
                },
                high: {
                  base: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200",
                  active: "bg-red-500 text-white border-red-500 shadow-lg shadow-red-200"
                }
              };

              const colorClass = isActive
                ? colors[level as keyof typeof colors].active
                : colors[level as keyof typeof colors].base;
              const transform = isActive ? "scale-105" : "scale-100";

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level as "low" | "medium" | "high")}
                  className={`px-4 py-2 rounded-xl border-2 font-semibold transition-all duration-200 ${colorClass} transform ${transform} hover:scale-105`}
                  disabled={isSubmitting}
                >
                  {level === "low" && "🟢 Ưu tiên thấp"}
                  {level === "medium" && "🟡 Ưu tiên trung bình"}
                  {level === "high" && "🔴 Ưu tiên cao"}
                </button>
              );
            })}
          </div>
        </div>

        {/* Deadline */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">Deadline (Optional)</label>
          <input
            type="datetime-local"
            value={deadlineAt}
            onChange={(e) => setDeadlineAt(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none transition-all duration-200 shadow-sm"
            disabled={isSubmitting}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:transform-none"
        >
          <Plus size={20} />
          {isSubmitting ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </div>
  );
};

export default AddTodo;
