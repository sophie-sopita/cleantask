import '@testing-library/jest-dom'
import {
  formatDate,
  formatTime,
  capitalizeFirst,
  truncateText,
  validateEmail,
  generateId,
  debounce,
  classNames
} from '../utils'

// Tests for the utility functions
describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('formats date correctly in Spanish locale', () => {
      const date = new Date('2024-01-15T10:30:00.000Z')
      const formatted = formatDate(date)
      
      expect(formatted).toMatch(/15 de enero de 2024/)
    })

    it('handles different dates correctly', () => {
      const date1 = new Date('2024-12-25T00:00:00.000Z')
      const date2 = new Date('2024-06-01T12:00:00.000Z')
      
      expect(formatDate(date1)).toMatch(/24 de diciembre de 2024|25 de diciembre de 2024/)
      expect(formatDate(date2)).toMatch(/1 de junio de 2024|31 de mayo de 2024/)
    })
  })

  describe('formatTime', () => {
    it('formats time correctly in Spanish locale', () => {
      const date = new Date('2024-01-15T14:30:00.000Z')
      const formatted = formatTime(date)
      
      expect(formatted).toMatch(/\d{2}:\d{2}/)
    })

    it('handles different times correctly', () => {
      const morning = new Date('2024-01-15T09:15:00.000Z')
      const evening = new Date('2024-01-15T21:45:00.000Z')
      
      const morningFormatted = formatTime(morning)
      const eveningFormatted = formatTime(evening)
      
      expect(morningFormatted).toMatch(/\d{2}:\d{2}/)
      expect(eveningFormatted).toMatch(/\d{2}:\d{2}/)
    })
  })

  describe('capitalizeFirst', () => {
    it('capitalizes first letter and lowercases the rest', () => {
      expect(capitalizeFirst('hello')).toBe('Hello')
      expect(capitalizeFirst('WORLD')).toBe('World')
      expect(capitalizeFirst('tEST')).toBe('Test')
    })

    it('handles empty string', () => {
      expect(capitalizeFirst('')).toBe('')
    })

    it('handles single character', () => {
      expect(capitalizeFirst('a')).toBe('A')
      expect(capitalizeFirst('Z')).toBe('Z')
    })

    it('handles special characters', () => {
      expect(capitalizeFirst('ñoño')).toBe('Ñoño')
      expect(capitalizeFirst('áéíóú')).toBe('Áéíóú')
    })
  })

  describe('truncateText', () => {
    it('truncates text when longer than maxLength', () => {
      const longText = 'This is a very long text that should be truncated'
      expect(truncateText(longText, 20)).toBe('This is a very long ...')
    })

    it('returns original text when shorter than maxLength', () => {
      const shortText = 'Short text'
      expect(truncateText(shortText, 20)).toBe('Short text')
    })

    it('returns original text when equal to maxLength', () => {
      const exactText = 'Exactly twenty chars'
      expect(truncateText(exactText, 20)).toBe('Exactly twenty chars')
    })

    it('handles empty string', () => {
      expect(truncateText('', 10)).toBe('')
    })
  })

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test.example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('generateId', () => {
    it('generates a string id', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('generates unique ids', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('generates ids with expected length', () => {
      const id = generateId()
      expect(id.length).toBe(9)
    })
  })

  describe('debounce', () => {
    jest.useFakeTimers()

    it('delays function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('test')
      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledWith('test')
    })

    it('cancels previous calls when called multiple times', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn('first')
      debouncedFn('second')
      debouncedFn('third')

      jest.advanceTimersByTime(100)
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('third')
    })

    afterEach(() => {
      jest.clearAllTimers()
    })
  })

  describe('classNames', () => {
    it('joins valid class names', () => {
      expect(classNames('class1', 'class2', 'class3')).toBe('class1 class2 class3')
    })

    it('filters out falsy values', () => {
      expect(classNames('class1', null, 'class2', undefined, false, 'class3')).toBe('class1 class2 class3')
    })

    it('handles empty input', () => {
      expect(classNames()).toBe('')
    })

    it('handles all falsy values', () => {
      expect(classNames(null, undefined, false, '')).toBe('')
    })

    it('handles conditional classes', () => {
      const isActive = true
      const isDisabled = false
      
      expect(classNames(
        'base-class',
        isActive && 'active',
        isDisabled && 'disabled'
      )).toBe('base-class active')
    })
  })
})