export interface User {
  id: string;
  name: string;
  email: string;
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