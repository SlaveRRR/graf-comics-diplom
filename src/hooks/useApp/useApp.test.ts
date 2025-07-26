import { renderHook } from '@testing-library/react';
import { useApp } from './useApp';

describe('useApp', () => {
  test('проверка работы хука', () => {
    const { result } = renderHook(() => useApp());

    expect(result.current).toMatchObject({});
  });
});
