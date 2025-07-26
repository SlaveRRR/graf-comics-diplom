import { useCallback } from 'react';

export const useLocalStorage = () => {
  const setItem = useCallback((key: string, value: unknown) => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, []);

  const getItem = useCallback((key: string): string | null => {
    const item = window.localStorage.getItem(key);

    return item ? JSON.parse(item) : null;
  }, []);

  const removeItem = useCallback((key: string): void => {
    window.localStorage.removeItem(key);
  }, []);

  return { setItem, getItem, removeItem };
};
