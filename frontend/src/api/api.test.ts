import { vi } from 'vitest';
import { api } from './api';

const mockAxiosGet = vi.fn();

vi.mock('axios', () => ({
  default: {
    get: () => mockAxiosGet(),
  },
}));

const mockGet = vi.fn();

const mockPost = vi.fn();

vi.mock('./utils', () => ({
  axiosInstance: {
    get: () => mockGet(),
    post: () => mockPost(),
  },
}));

describe('api', () => {
  test('проверка методов api', () => {
    expect(api).toMatchObject({
      signIn: expect.any(Function),
      signUp: expect.any(Function),
      refreshToken: expect.any(Function),
      logout: expect.any(Function),
      getCurrentUser: expect.any(Function),
    });
  });

  test('проверка вызова signIn', () => {
    api.signIn({ password: '', username: '' });

    expect(mockPost).toBeCalled();
  });

  test('проверка вызова signUp', () => {
    api.signUp({ password: '', username: '', email: '' });

    expect(mockPost).toBeCalled();
  });

  test('проверка вызова refreshToken', () => {
    api.refreshToken();

    expect(mockAxiosGet).toBeCalled();
  });

  test('проверка вызова logout', () => {
    api.logout();

    expect(mockPost).toBeCalled();
  });

  test('проверка вызова getCurrentUser', () => {
    api.getCurrentUser();

    expect(mockGet).toBeCalled();
  });
});
