import { User, UserPreferences, CreateUserDto, UpdateUserDto } from '../model'

describe('User Model Types', () => {
  describe('User interface', () => {
    it('should have all required properties', () => {
      const user: User = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        preferences: {
          theme: 'light',
          language: 'es',
          notifications: true,
          defaultTaskPriority: 'medium',
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      }

      expect(user.id).toBe('123')
      expect(user.name).toBe('John Doe')
      expect(user.email).toBe('john@example.com')
      expect(user.preferences).toBeDefined()
      expect(user.createdAt).toBeInstanceOf(Date)
      expect(user.updatedAt).toBeInstanceOf(Date)
    })

    it('should allow optional avatar property', () => {
      const userWithAvatar: User = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://example.com/avatar.jpg',
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: false,
          defaultTaskPriority: 'high',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(userWithAvatar.avatar).toBe('https://example.com/avatar.jpg')

      const userWithoutAvatar: User = {
        id: '456',
        name: 'Jane Doe',
        email: 'jane@example.com',
        preferences: {
          theme: 'system',
          language: 'es',
          notifications: true,
          defaultTaskPriority: 'low',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(userWithoutAvatar.avatar).toBeUndefined()
    })
  })

  describe('UserPreferences interface', () => {
    it('should have correct theme options', () => {
      const lightTheme: UserPreferences = {
        theme: 'light',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'medium',
      }

      const darkTheme: UserPreferences = {
        theme: 'dark',
        language: 'en',
        notifications: false,
        defaultTaskPriority: 'high',
      }

      const systemTheme: UserPreferences = {
        theme: 'system',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'low',
      }

      expect(lightTheme.theme).toBe('light')
      expect(darkTheme.theme).toBe('dark')
      expect(systemTheme.theme).toBe('system')
    })

    it('should have correct language options', () => {
      const spanishPrefs: UserPreferences = {
        theme: 'light',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'medium',
      }

      const englishPrefs: UserPreferences = {
        theme: 'light',
        language: 'en',
        notifications: true,
        defaultTaskPriority: 'medium',
      }

      expect(spanishPrefs.language).toBe('es')
      expect(englishPrefs.language).toBe('en')
    })

    it('should have correct priority options', () => {
      const lowPriority: UserPreferences = {
        theme: 'light',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'low',
      }

      const mediumPriority: UserPreferences = {
        theme: 'light',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'medium',
      }

      const highPriority: UserPreferences = {
        theme: 'light',
        language: 'es',
        notifications: true,
        defaultTaskPriority: 'high',
      }

      expect(lowPriority.defaultTaskPriority).toBe('low')
      expect(mediumPriority.defaultTaskPriority).toBe('medium')
      expect(highPriority.defaultTaskPriority).toBe('high')
    })
  })

  describe('CreateUserDto interface', () => {
    it('should have required properties for user creation', () => {
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
      }

      expect(createUserDto.name).toBe('New User')
      expect(createUserDto.email).toBe('newuser@example.com')
    })

    it('should allow optional avatar in creation', () => {
      const createUserWithAvatar: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
        avatar: 'https://example.com/new-avatar.jpg',
      }

      expect(createUserWithAvatar.avatar).toBe('https://example.com/new-avatar.jpg')

      const createUserWithoutAvatar: CreateUserDto = {
        name: 'New User',
        email: 'newuser@example.com',
      }

      expect(createUserWithoutAvatar.avatar).toBeUndefined()
    })
  })

  describe('UpdateUserDto interface', () => {
    it('should allow partial updates of user properties', () => {
      const updateName: UpdateUserDto = {
        name: 'Updated Name',
      }

      const updateEmail: UpdateUserDto = {
        email: 'updated@example.com',
      }

      const updateAvatar: UpdateUserDto = {
        avatar: 'https://example.com/updated-avatar.jpg',
      }

      expect(updateName.name).toBe('Updated Name')
      expect(updateName.email).toBeUndefined()
      expect(updateName.avatar).toBeUndefined()

      expect(updateEmail.email).toBe('updated@example.com')
      expect(updateEmail.name).toBeUndefined()

      expect(updateAvatar.avatar).toBe('https://example.com/updated-avatar.jpg')
    })

    it('should allow partial preferences updates', () => {
      const updatePreferences: UpdateUserDto = {
        preferences: {
          theme: 'dark',
          notifications: false,
        },
      }

      expect(updatePreferences.preferences?.theme).toBe('dark')
      expect(updatePreferences.preferences?.notifications).toBe(false)
      expect(updatePreferences.preferences?.language).toBeUndefined()
      expect(updatePreferences.preferences?.defaultTaskPriority).toBeUndefined()
    })

    it('should allow updating multiple properties at once', () => {
      const updateMultiple: UpdateUserDto = {
        name: 'Updated Name',
        email: 'updated@example.com',
        avatar: 'https://example.com/updated.jpg',
        preferences: {
          theme: 'system',
          language: 'en',
        },
      }

      expect(updateMultiple.name).toBe('Updated Name')
      expect(updateMultiple.email).toBe('updated@example.com')
      expect(updateMultiple.avatar).toBe('https://example.com/updated.jpg')
      expect(updateMultiple.preferences?.theme).toBe('system')
      expect(updateMultiple.preferences?.language).toBe('en')
    })

    it('should allow empty update object', () => {
      const emptyUpdate: UpdateUserDto = {}

      expect(Object.keys(emptyUpdate)).toHaveLength(0)
    })
  })
})