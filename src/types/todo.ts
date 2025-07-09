export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  createdAt?: string;
  deadline_at?: string;
  completedAt?: string;
}