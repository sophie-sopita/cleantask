/**
 * User entity model
 * Represents a user in the CleanTask system
 */
export type User = {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

/**
 * User creation payload (without id)
 */
export type CreateUserPayload = Omit<User, 'id'>

/**
 * User registration payload (includes password)
 */
export type RegisterUserPayload = CreateUserPayload & {
  password: string
}

/**
 * User update payload (partial fields)
 */
export type UpdateUserPayload = Partial<Omit<User, 'id'>>

// Extended User interface for future features
export interface ExtendedUser extends User {
  avatar?: string;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'es' | 'en';
  notifications: boolean;
  defaultTaskPriority: 'low' | 'medium' | 'high';
}

export interface CreateUserDto {
  name: string;
  email: string;
  avatar?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}