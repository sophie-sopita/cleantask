import { User, ExtendedUser, UserPreferences, CreateUserDto, UpdateUserDto } from '../model'

describe('User Model', () => {
  describe('User type', () => {
    it('should create a valid User object', () => {
      const user: User = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      }

      expect(user.id).toBe('1')
      expect(user.name).toBe('John Doe')
      expect(user.email).toBe('john@example.com')
      expect(user.role).toBe('user')
    })

    it('should validate user properties', () => {
      const user: User = {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin'
      }

      expect(user).toHaveProperty('id')
      expect(user).toHaveProperty('name')
      expect(user).toHaveProperty('email')
      expect(user).toHaveProperty('role')
    })
  })

  describe('ExtendedUser interface', () => {
    it('should create a valid ExtendedUser object', () => {
      const preferences: UserPreferences = {
        theme: 'dark',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'medium'
      }

      const extendedUser: ExtendedUser = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        avatar: 'https://example.com/avatar.jpg',
        preferences,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      expect(extendedUser.preferences).toBeDefined()
      expect(extendedUser.createdAt).toBeInstanceOf(Date)
      expect(extendedUser.updatedAt).toBeInstanceOf(Date)
      expect(extendedUser.avatar).toBe('https://example.com/avatar.jpg')
    })

    it('should validate extended user properties', () => {
      const preferences: UserPreferences = {
        theme: 'light',
        language: 'en',
        notifications: false,
        defaultTaskPriority: 'high'
      }

      const extendedUser: ExtendedUser = {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'admin',
        preferences,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      expect(extendedUser.preferences.theme).toBe('light')
      expect(extendedUser.preferences.language).toBe('en')
      expect(extendedUser.preferences.notifications).toBe(false)
      expect(extendedUser.preferences.defaultTaskPriority).toBe('high')
    })
  })

  describe('UserPreferences interface', () => {
    it('should create valid user preferences', () => {
      const preferences: UserPreferences = {
        theme: 'system',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'low'
      }

      expect(preferences.theme).toBe('system')
      expect(preferences.language).toBe('es')
      expect(preferences.notifications).toBe(true)
      expect(preferences.defaultTaskPriority).toBe('low')
    })

    it('should validate theme options', () => {
      const lightTheme: UserPreferences = {
        theme: 'light',
        language: 'en',
        notifications: true,
        defaultTaskPriority: 'medium'
      }

      const darkTheme: UserPreferences = {
        theme: 'dark',
        language: 'es',
        notifications: false,
        defaultTaskPriority: 'high'
      }

      expect(lightTheme.theme).toBe('light')
      expect(darkTheme.theme).toBe('dark')
    })

    it('should validate language options', () => {
      const spanishPrefs: UserPreferences = {
        theme: 'light',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'medium'
      }

      const englishPrefs: UserPreferences = {
        theme: 'dark',
        language: 'en',
        notifications: false,
        defaultTaskPriority: 'low'
      }

      expect(spanishPrefs.language).toBe('es')
      expect(englishPrefs.language).toBe('en')
    })

    it('should validate priority options', () => {
      const lowPriority: UserPreferences = {
        theme: 'light',
        language: 'en',
        notifications: true,
        defaultTaskPriority: 'low'
      }

      const mediumPriority: UserPreferences = {
        theme: 'dark',
        language: 'es',
        notifications: false,
        defaultTaskPriority: 'medium'
      }

      const highPriority: UserPreferences = {
        theme: 'system',
        language: 'en',
        notifications: true,
        defaultTaskPriority: 'high'
      }

      expect(lowPriority.defaultTaskPriority).toBe('low')
      expect(mediumPriority.defaultTaskPriority).toBe('medium')
      expect(highPriority.defaultTaskPriority).toBe('high')
    })
  })

  describe('CreateUserDto interface', () => {
    it('should create valid CreateUserDto object', () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        avatar: 'https://example.com/new-avatar.jpg'
      }

      expect(createUserDto.name).toBe('New User')
      expect(createUserDto.email).toBe('newuser@example.com')
      expect(createUserDto.avatar).toBe('https://example.com/new-avatar.jpg')
    })

    it('should create CreateUserDto without optional avatar', () => {
      const createUserDto: CreateUserDto = {
        name: 'Another User',
        email: 'another@example.com'
      }

      expect(createUserDto.name).toBe('Another User')
      expect(createUserDto.email).toBe('another@example.com')
      expect(createUserDto.avatar).toBeUndefined()
    })
  })

  describe('UpdateUserDto interface', () => {
    it('should create valid UpdateUserDto object', () => {
      const preferences: Partial<UserPreferences> = {
        theme: 'dark',
        notifications: false
      }

      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        avatar: 'https://example.com/updated-avatar.jpg',
        preferences
      }

      expect(updateUserDto.name).toBe('Updated Name')
      expect(updateUserDto.email).toBe('updated@example.com')
      expect(updateUserDto.avatar).toBe('https://example.com/updated-avatar.jpg')
      expect(updateUserDto.preferences?.theme).toBe('dark')
      expect(updateUserDto.preferences?.notifications).toBe(false)
    })

    it('should create partial UpdateUserDto object', () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Only Name Updated'
      }

      expect(updateUserDto.name).toBe('Only Name Updated')
      expect(updateUserDto.email).toBeUndefined()
      expect(updateUserDto.avatar).toBeUndefined()
      expect(updateUserDto.preferences).toBeUndefined()
    })

    it('should update only preferences', () => {
      const preferences: Partial<UserPreferences> = {
        language: 'es',
        defaultTaskPriority: 'high'
      }

      const updateUserDto: UpdateUserDto = {
        preferences
      }

      expect(updateUserDto.preferences?.language).toBe('es')
      expect(updateUserDto.preferences?.defaultTaskPriority).toBe('high')
      expect(updateUserDto.name).toBeUndefined()
      expect(updateUserDto.email).toBeUndefined()
    })
  })
})