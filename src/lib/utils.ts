import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const BASE_API_URL = "http://localhost:4000/todos";

export async function request<T>(
  pathOrUrl: string,
  options?: RequestInit
): Promise<T> {
  // Nếu pathOrUrl là path (bắt đầu bằng / hoặc không có http), nối với BASE_API_URL
  const url = pathOrUrl.startsWith("http") ? pathOrUrl : `${BASE_API_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'Request failed');
  }
  return data.data as T;
}
