export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}