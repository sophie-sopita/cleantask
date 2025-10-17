/**
 * Task entity model
 * Represents a task in the CleanTask system
 */
export type Task = {
  id: string
  title: string
  description?: string
  dueDate?: string
  status: 'pending' | 'done'
  userId: string
}

/**
 * Task creation payload (without id)
 */
export type CreateTaskPayload = Omit<Task, 'id'>

/**
 * Task update payload (partial fields)
 */
export type UpdateTaskPayload = Partial<Omit<Task, 'id' | 'userId'>>

/**
 * Task status options
 */
export const TaskStatus = {
  PENDING: 'pending' as const,
  DONE: 'done' as const,
} as const

// Extended Task interface for future features
export interface ExtendedTask extends Task {
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
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