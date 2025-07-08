export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'high' | 'medium' | 'low';
  createdAt?: string;
  deadlineAt?: string;
  completedAt?: string;
}