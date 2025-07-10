import { CheckCircle } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-pink-100 flex items-center justify-center">
      <div className="text-center flex flex-col items-center">
        <span className="relative flex h-16 w-16 mb-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-16 w-16 bg-white border-4 border-red-400 items-center justify-center">
            <CheckCircle className="w-8 h-8 text-red-400 animate-bounce" />
          </span>
        </span>
        <p className="text-gray-700 font-semibold text-lg mb-1">Preparing everything for you...</p>
        <p className="text-gray-500 text-sm">Let's plan for a productive day! 🚀</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;