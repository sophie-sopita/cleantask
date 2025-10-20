/**
 * Task entity model
 * Represents a task in the CleanTask system
 */
export type Task = {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority?: 'low' | 'medium' | 'high'
  status: 'pending' | 'done'
  userId: string
  createdAt: string
}

/**
 * Task creation payload (without id)
 */
export type CreateTaskPayload = Omit<Task, 'id' | 'createdAt'>

/**
 * Task update payload (partial fields)
 */
export type UpdateTaskPayload = Partial<Omit<Task, 'id' | 'userId' | 'createdAt'>>

/**
 * Task priority options
 */
export const TaskPriority = {
  LOW: 'low' as const,
  MEDIUM: 'medium' as const,
  HIGH: 'high' as const,
} as const

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
  category?: string;
  createdAt: string;
  updatedAt: string;
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