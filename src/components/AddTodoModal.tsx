import { useState } from "react";
import { Plus, X } from "lucide-react";

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (
    title: string,
    description?: string,
    priority?: "low" | "medium" | "high",
    deadlineAt?: string
  ) => void;
}

const AddTodoModal = ({ isOpen, onClose, onAdd }: AddTodoModalProps) => {
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

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDeadlineAt("");
      console.log("Todo submitted:", title.trim(), description.trim());
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen) return null;

   return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Phông nền mờ */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleClose}
      ></div>
      
      {/* Hộp thoại thêm công việc */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
        {/* Tiêu đề */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Plus size={18} className="text-white" />
            </div>
            Thêm việc mới
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Biểu mẫu */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tiêu đề công việc */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Tiêu đề công việc</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bạn cần làm gì?"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-800"
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Mô tả (Không bắt buộc)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Thêm chi tiết về công việc của bạn..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none focus:bg-white transition-all duration-200 placeholder-gray-400 text-gray-800 resize-none"
              disabled={isSubmitting}
            />
          </div>

          {/* Mức độ ưu tiên */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">Mức độ ưu tiên</label>
            <div className="flex gap-2">
              {["low", "medium", "high"].map((level) => {
                const isActive = priority === level;
                const colors = {
                  low: {
                    base: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
                    active: "bg-green-500 text-white border-green-500 shadow-lg shadow-green-200"
                  },
                  medium: {
                    base: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
                    active: "bg-yellow-500 text-white border-yellow-500 shadow-lg shadow-yellow-200"
                  },
                  high: {
                    base: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
                    active: "bg-red-500 text-white border-red-500 shadow-lg shadow-red-200"
                  }
                };

                const colorClass = isActive
                  ? colors[level as keyof typeof colors].active
                  : colors[level as keyof typeof colors].base;

                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setPriority(level as "low" | "medium" | "high")}
                    className={`flex-1 px-3 py-2 rounded-xl border-2 font-semibold transition-all duration-200 ${colorClass} text-sm hover:scale-105 ${isActive ? 'scale-105' : ''}`}
                    disabled={isSubmitting}
                  >
                    {level === "low" && "🟢 Thấp"}
                    {level === "medium" && "🟡 Trung bình"}
                    {level === "high" && "🔴 Cao"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hạn chót */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Hạn chót (Không bắt buộc)</label>
            <input
              type="datetime-local"
              value={deadlineAt}
              onChange={(e) => setDeadlineAt(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:outline-none focus:bg-white transition-all duration-200"
              disabled={isSubmitting}
            />
          </div>

          {/* Nút gửi */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 font-semibold shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? "Đang thêm..." : "Thêm công việc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTodoModal;