
const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-gray-600">Loading todos...</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
