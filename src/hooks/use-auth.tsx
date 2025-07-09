import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as apiLogin, register as apiRegister, setToken, getToken, removeToken } from '../lib/api';

interface UserMetadata {
  username?: string;
  email?: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  sub?: string;
}

interface User {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
  [key: string]: unknown;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, rePassword: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Nếu có token, lấy user từ localStorage hoặc từ API nếu cần
    if (token) {
      // Có thể lưu user vào localStorage nếu muốn
      const userStr = localStorage.getItem('user');
      if (userStr) setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const res = await apiLogin(email, password);
    setToken(res.session.access_token);
    setTokenState(res.session.access_token);
    setUser(res.user);
    localStorage.setItem('user', JSON.stringify(res.user));
    setLoading(false);
  };

  const register = async (username: string, email: string, password: string, rePassword: string) => {
    setLoading(true);
    await apiRegister(username, email, password, rePassword);
    // Đăng ký xong tự động đăng nhập
    await login(email, password);
    setLoading(false);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 