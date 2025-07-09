import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Label } from "@/components/ui/label";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { login, register, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!username.trim()) {
          setError("Vui lòng nhập tên người dùng");
          return;
        }
        if (password !== rePassword) {
          setError("Mật khẩu nhập lại không khớp");
          return;
        }
        await register(username, email, password, rePassword);
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đã có lỗi xảy ra");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-8 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-2 text-center">
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {!isLogin && (
            <div>
              <Label htmlFor="username">Tên người dùng</Label>
              <Input
                id="username"
                type="text"
                placeholder="Tên người dùng"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                className="mt-1"
              />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus={isLogin}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          {!isLogin && (
            <div>
              <Label htmlFor="rePassword">Nhập lại mật khẩu</Label>
              <Input
                id="rePassword"
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={rePassword}
                onChange={e => setRePassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
          )}
          {error && <div className="text-red-500 text-sm text-center mt-2">{error}</div>}
          <Button type="submit" className="w-full mt-2 text-base py-2 rounded-md" variant="default" disabled={loading}>
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </form>
        <div className="text-center text-sm mt-6">
          {isLogin ? (
            <>
              <span>Chưa có tài khoản?</span>{' '}
              <button
                className="text-red-600 font-semibold underline hover:text-red-700 transition-colors"
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Đăng ký
              </button>
            </>
          ) : (
            <>
              <span>Đã có tài khoản?</span>{' '}
              <button
                className="text-red-600 font-semibold underline hover:text-red-700 transition-colors"
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal; 