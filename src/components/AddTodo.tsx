import { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddTodoProps {
  onAdd: (title: string, description?: string) => void;
}

const AddTodo = ({ onAdd }: AddTodoProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(title.trim(), description.trim() || undefined);
      setTitle('');
      setDescription('');
      console.log('Todo submitted:', title.trim(), description.trim());
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

      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 font-medium self-start"
      >
        <Plus size={20} />
        {isSubmitting ? 'Adding...' : 'Add'}
      </button>
    </form>
  );
};

export default AddTodo;
