
interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center max-w-md">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">{message}</p>
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
