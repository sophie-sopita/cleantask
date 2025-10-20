import { renderHook, act } from '@testing-library/react'
import { useState } from 'react'

// Mock implementation of useLocalStorage hook
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => {
      return store[key] || null
    },
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock console.error to avoid noise in tests
const originalConsoleError = console.error
beforeEach(() => {
  console.error = jest.fn()
  localStorageMock.clear()
  jest.clearAllMocks()
})

afterEach(() => {
  console.error = originalConsoleError
})

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('initial')
  })

  it('should return stored value from localStorage', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored'))
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    expect(result.current[0]).toBe('stored')
  })

  it('should update localStorage when setValue is called', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('updated')
    })

    expect(localStorageMock.getItem('test-key')).toBe('"updated"')
  })

  it('should work with number values', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    
    act(() => {
      result.current[1](42)
    })

    expect(result.current[0]).toBe(42)
    expect(localStorageMock.getItem('counter')).toBe('42')
  })

  it('should work with object values', () => {
    const initialObject = { name: 'test', count: 0 }
    const { result } = renderHook(() => useLocalStorage('user', initialObject))
    
    const updatedObject = { name: 'updated', count: 5 }
    act(() => {
      result.current[1](updatedObject)
    })

    expect(result.current[0]).toEqual(updatedObject)
    expect(JSON.parse(localStorageMock.getItem('user') || '{}')).toEqual(updatedObject)
  })

  it('should work with array values', () => {
    const initialArray = ['item1', 'item2']
    const { result } = renderHook(() => useLocalStorage('items', initialArray))
    
    const updatedArray = ['item1', 'item2', 'item3']
    act(() => {
      result.current[1](updatedArray)
    })

    expect(result.current[0]).toEqual(updatedArray)
    expect(JSON.parse(localStorageMock.getItem('items') || '[]')).toEqual(updatedArray)
  })

  it('should work with boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('isEnabled', false))
    
    act(() => {
      result.current[1](true)
    })

    expect(result.current[0]).toBe(true)
    expect(localStorageMock.getItem('isEnabled')).toBe('true')
  })

  it('should handle null values', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>('nullable', null))
    
    act(() => {
      result.current[1]('not null')
    })

    expect(result.current[0]).toBe('not null')
    expect(localStorageMock.getItem('nullable')).toBe('"not null"')
  })

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.getItem to throw an error
    const originalGetItem = localStorageMock.getItem
    localStorageMock.getItem = jest.fn(() => {
      throw new Error('localStorage error')
    })

    const { result } = renderHook(() => useLocalStorage('error-key', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
    expect(console.error).toHaveBeenCalled()

    // Restore original method
    localStorageMock.getItem = originalGetItem
  })

  it('should handle JSON parsing errors', () => {
    localStorageMock.setItem('invalid-json', 'invalid json string')
    const { result } = renderHook(() => useLocalStorage('invalid-json', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
  })

  it('should persist values across hook instances', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('persist-test', 'initial'))
    
    act(() => {
      result.current[1]('persisted')
    })

    rerender()
    expect(result.current[0]).toBe('persisted')
  })

  it('should handle multiple keys independently', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'))
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'))
    
    act(() => {
      result1.current[1]('updated1')
      result2.current[1]('updated2')
    })

    expect(result1.current[0]).toBe('updated1')
    expect(result2.current[0]).toBe('updated2')
    expect(localStorageMock.getItem('key1')).toBe('"updated1"')
    expect(localStorageMock.getItem('key2')).toBe('"updated2"')
  })
})