import { renderHook, act } from '@testing-library/react'

// Custom hook for localStorage
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.log(error)
    }
  }

  return [storedValue, setValue] as const
}

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Import React after mocking localStorage
import React from 'react'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    expect(result.current[0]).toBe('initial')
  })

  it('returns value from localStorage when available', () => {
    localStorageMock.setItem('test-key', JSON.stringify('stored-value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    expect(result.current[0]).toBe('stored-value')
  })

  it('updates localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new-value')
    })
    
    expect(result.current[0]).toBe('new-value')
    expect(JSON.parse(localStorageMock.getItem('test-key')!)).toBe('new-value')
  })

  it('works with function updates', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0))
    
    act(() => {
      result.current[1](prev => prev + 1)
    })
    
    expect(result.current[0]).toBe(1)
    expect(JSON.parse(localStorageMock.getItem('counter')!)).toBe(1)
  })

  it('handles complex objects', () => {
    const initialObject = { name: 'John', age: 30 }
    const { result } = renderHook(() => useLocalStorage('user', initialObject))
    
    const updatedObject = { name: 'Jane', age: 25 }
    
    act(() => {
      result.current[1](updatedObject)
    })
    
    expect(result.current[0]).toEqual(updatedObject)
    expect(JSON.parse(localStorageMock.getItem('user')!)).toEqual(updatedObject)
  })

  it('handles arrays', () => {
    const initialArray = ['item1', 'item2']
    const { result } = renderHook(() => useLocalStorage('items', initialArray))
    
    act(() => {
      result.current[1](prev => [...prev, 'item3'])
    })
    
    expect(result.current[0]).toEqual(['item1', 'item2', 'item3'])
    expect(JSON.parse(localStorageMock.getItem('items')!)).toEqual(['item1', 'item2', 'item3'])
  })

  it('handles boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('isEnabled', false))
    
    act(() => {
      result.current[1](true)
    })
    
    expect(result.current[0]).toBe(true)
    expect(JSON.parse(localStorageMock.getItem('isEnabled')!)).toBe(true)
  })

  it('handles null values', () => {
    const { result } = renderHook(() => useLocalStorage('nullable', null))
    
    act(() => {
      result.current[1]('not-null')
    })
    
    expect(result.current[0]).toBe('not-null')
    expect(JSON.parse(localStorageMock.getItem('nullable')!)).toBe('not-null')
  })

  it('returns initial value when localStorage throws error', () => {
    // Mock localStorage.getItem to throw an error
    const originalGetItem = localStorageMock.getItem
    localStorageMock.getItem = jest.fn(() => {
      throw new Error('localStorage error')
    })
    
    const { result } = renderHook(() => useLocalStorage('error-key', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
    
    // Restore original method
    localStorageMock.getItem = originalGetItem
  })

  it('handles invalid JSON in localStorage', () => {
    localStorageMock.setItem('invalid-json', 'invalid json string')
    
    const { result } = renderHook(() => useLocalStorage('invalid-json', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
  })

  it('persists value across hook re-renders', () => {
    const { result, rerender } = renderHook(() => useLocalStorage('persist-test', 'initial'))
    
    act(() => {
      result.current[1]('updated')
    })
    
    rerender()
    
    expect(result.current[0]).toBe('updated')
  })

  it('handles different keys independently', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('key1', 'value1'))
    const { result: result2 } = renderHook(() => useLocalStorage('key2', 'value2'))
    
    act(() => {
      result1.current[1]('updated1')
    })
    
    act(() => {
      result2.current[1]('updated2')
    })
    
    expect(result1.current[0]).toBe('updated1')
    expect(result2.current[0]).toBe('updated2')
    expect(JSON.parse(localStorageMock.getItem('key1')!)).toBe('updated1')
    expect(JSON.parse(localStorageMock.getItem('key2')!)).toBe('updated2')
  })
})