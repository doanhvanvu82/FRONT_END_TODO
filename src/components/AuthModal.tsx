import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  isLogin?: boolean;
  onModeSwitch?: (isLogin: boolean) => void;
  onRegisterSuccess?: () => void;
}

const REMEMBER_KEY = "todoapp_remember";

const AuthModal = ({ open, onClose, isLogin: isLoginProp, onModeSwitch, onRegisterSuccess }: AuthModalProps) => {
  const { login, register, loading } = useAuth();
  const { toast } = useToast();
  const [internalIsLogin, setInternalIsLogin] = useState(true);
  const isLogin = isLoginProp !== undefined ? isLoginProp : internalIsLogin;
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
        } catch {
          // Ignore JSON parse errors
        }
      }
    }
    if (!open) {
      setError(null);
    }
  }, [open, isLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Client-side validation
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    try {
      if (isLogin) {
        await login(email, password);
        if (remember) {
          localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email, password }));
        } else {
          localStorage.removeItem(REMEMBER_KEY);
        }
        onClose(); // <-- Chỉ gọi khi không có lỗi
      } else {
        if (!username.trim()) {
          setError("Please enter a username");
          return;
        }
        if (password !== rePassword) {
          setError("Passwords do not match");
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          return;
        }
        await register(username, email, password, rePassword);
        if (onRegisterSuccess) {
          onRegisterSuccess();
        } else {
          onClose();
        }
      }
    } catch (err: unknown) {
      let msg = err instanceof Error ? err.message : "An error occurred. Please try again.";
      if (isLogin && msg === "Invalid login credentials") {
        msg = "Incorrect email or password.";
      } else if (!isLogin && msg === "User already registered") {
        msg = "Email is already registered.";
      }
      setError(msg);
      // Removed toast notifications for login and register errors
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null); // Clear error when user starts typing
    if (remember) setRemember(false);
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError(null); // Clear error when user starts typing
    if (remember) setRemember(false);
  };
  
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    if (error) setError(null); // Clear error when user starts typing
  };
  
  const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRePassword(e.target.value);
    if (error) setError(null); // Clear error when user starts typing
  };

  const clearForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRePassword("");
    setError(null);
  };

  const handleModeSwitch = (newMode: boolean) => {
    if (onModeSwitch) {
      onModeSwitch(newMode);
    } else {
      setInternalIsLogin(newMode);
    }
    // clearForm(); // Bỏ reset form khi chuyển mode
  };

  useEffect(() => {
    if (!open) {
      clearForm(); // Chỉ reset form khi đóng modal
    }
  }, [open]);

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
                onChange={handleUsernameChange}
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
              onChange={handleEmailChange}
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
              onChange={handlePasswordChange}
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
                onChange={handleRePasswordChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            </div>
          )}
          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={e => {
                    setRemember(e.target.checked);
                    if (!e.target.checked) {
                      localStorage.removeItem(REMEMBER_KEY);
                    }
                  }}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 select-none">Remember me</label>
              </div>
              <button
                type="button"
                className="text-sm text-red-600 hover:text-red-700 underline"
                onClick={() => {
                  // TODO: Implement forgot password functionality
                  alert("Forgot password functionality will be implemented soon.");
                }}
              >
                Forgot password?
              </button>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 -mt-2">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-2 rounded-md text-white font-semibold text-base bg-red-500 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isLogin ? "Signing in..." : "Creating account..."}
              </>
            ) : (
              isLogin ? "Sign in" : "Register"
            )}
          </button>
          <div className="text-center text-sm mt-2">
            {isLogin ? (
              <>
                <span>New here? </span>
                <button
                  className="text-red-600 font-semibold underline hover:text-red-700 transition-colors"
                  onClick={() => handleModeSwitch(false)}
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
                  onClick={() => handleModeSwitch(true)}
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