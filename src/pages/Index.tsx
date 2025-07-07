
import TodoApp from '../components/TodoApp';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50">
      <div className="container mx-auto px-0 py-0">
           {/* Header */}
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2 ">
            Task Craft Studio
          </h1>
          <p className="text-gray-600 text-lg">Organize your tasks beautifully</p>
        </div>
        <TodoApp />
      </div>
    </div>
  );
};

export default Index;
