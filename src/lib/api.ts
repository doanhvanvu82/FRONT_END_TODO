// API endpoint
const API_URL = 'http://localhost:4000';

// Token helpers
export function setToken(token: string) {
  localStorage.setItem('access_token', token);
}
export function getToken(): string | null {
  return localStorage.getItem('access_token');
}
export function removeToken() {
  localStorage.removeItem('access_token');
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth
export async function register(username: string, email: string, password: string, rePassword: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, "re-enterPassword": rePassword }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || 'Đăng ký thất bại');
  }
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || 'Đăng nhập thất bại');
  }
  return data;
}

// Todos
export async function getTodos() {
  const res = await fetch(`${API_URL}/todos`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Lấy danh sách todo thất bại');
  return res.json();
}

export async function addTodo(todo: {
  title: string;
  description?: string;
  deadline_at?: string;
  priority?: 'low' | 'medium' | 'high';
}) {
  const res = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error('Tạo todo thất bại');
  return res.json();
}

export async function updateTodo(id: number, data: Partial<Todo>) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Cập nhật todo thất bại');
  return res.json();
}

export async function deleteTodo(id: number) {
  const res = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error('Xoá todo thất bại');
  return res.json();
} 