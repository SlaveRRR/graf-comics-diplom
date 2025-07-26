import { renderHook } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

const mockLocalStorage = (() => {
  const store = {} as Storage;

  return {
    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    removeItem(key: string) {
      delete store[key];
    },
  };
})();

beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });
});

describe('useLocalStorage', () => {
  test('проверка работы хука', () => {
    const { result } = renderHook(() => useLocalStorage());

    expect(result.current).toMatchObject({
      getItem: expect.any(Function),
      setItem: expect.any(Function),
      removeItem: expect.any(Function),
    });

    result.current.setItem('key', 'value');

    expect(result.current.getItem('key')).toBe('value');

    result.current.removeItem('key');

    expect(result.current.getItem('key')).toBeNull();
  });
});
