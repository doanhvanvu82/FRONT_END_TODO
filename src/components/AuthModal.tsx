import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const REMEMBER_KEY = "todoapp_remember";

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && isLogin) {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        try {
          const { email, password } = JSON.parse(saved);
          setEmail(email || "");
          setPassword(password || "");
          setRemember(true);
        } catch {}
      }
    }
    if (!open) {
      setError(null);
    }
  }, [open, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
        if (remember) {
          localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
      } else {
        if (!username.trim()) {
          setError("Please enter a username");
          return;
        }
        if (password !== rePassword) {
          setError("Passwords do not match");
          return;
        }
        await register(username, email, password, rePassword);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (open) {
    document.body.style.background = "#f6f9fb";
  } else {
    document.body.style.background = "";
  }

  return (
    open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-[#f6f9fb]">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl px-10 py-8 w-full max-w-md flex flex-col gap-6"
          style={{ minWidth: 340 }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-1">{isLogin ? "Sign in to your account" : "Create your account"}</h1>
            <div className="text-gray-500 text-base mb-4">
              {isLogin ? (
                <span>to add your task <span aria-label="peace" role="img">✌️</span></span>
              ) : (
                <span>and start managing your todos</span>
              )}
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="rePassword" className="block text-sm font-medium text-gray-700 mb-1">Re-enter password</label>
              <input
                id="rePassword"
                type="password"
                placeholder="Re-enter password"
                value={rePassword}
                onChange={e => setRePassword(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}

          {isLogin && (
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-700 select-none">Remember me</label>
            </div>
          )}

          {error && <div className="text-red-500 text-sm text-center -mt-2">{error}</div>}

          <button
            type="submit"
            className="w-full py-2 rounded-md text-white font-semibold text-base bg-red-500 hover:bg-red-600 transition-colors"
            disabled={loading}
          >
            {isLogin ? "Sign in" : "Register"}
          </button>

          <div className="text-center text-sm mt-2">
            {isLogin ? (
              <>
                <span>New here? </span>
                <button
                  className="text-red-600 font-semibold underline hover:text-red-700 transition-colors"
                  onClick={() => setIsLogin(false)}
                  type="button"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <span>Already have an account? </span>
                <button
                  className="text-red-600 font-semibold underline hover:text-red-700 transition-colors"
                  onClick={() => setIsLogin(true)}
                  type="button"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    )
  );
};

export default AuthModal;
