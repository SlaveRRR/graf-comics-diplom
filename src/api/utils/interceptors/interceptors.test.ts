import { AxiosHeaders } from 'axios';
import { addAuthHeaderInterceptor, refreshTokenOnError } from './interceptors';

const mockError = vi.fn();

vi.mock('antd', () => ({
  message: {
    error: () => mockError(),
  },
}));

const mockAxiosGet = vi.fn();

const mockRequest = vi.fn();

vi.mock('axios', () => ({
  default: {
    get: () => mockAxiosGet(),
    create: () => ({
      request: () => mockRequest(),
      interceptors: {
        request: {
          use: vi.fn(),
        },
        response: {
          use: vi.fn(),
        },
      },
    }),
  },
}));

const mockSetItem = vi.fn();
const mockGetItem = vi.fn();

const localStorageMock = {
  getItem: () => mockGetItem(),
  setItem: () => mockSetItem(),
};

vi.stubGlobal('localStorage', localStorageMock);

describe('interceptors', () => {
  describe('addAuthHeaderInterceptor', () => {
    test('добавляет заголовок с токеном', () => {
      const token = 'test-token';

      mockGetItem.mockReturnValue(JSON.stringify(token));

      const config = addAuthHeaderInterceptor({ headers: {} as AxiosHeaders });

      expect(config.headers.Authorization).toBe(`Bearer ${token}`);
    });
  });

  describe('refreshTokenOnError', () => {
    test('отправляет запрос на рефреш токена в успешном случае', async () => {
      mockAxiosGet.mockReturnValue({ data: { access_token: '' } });
      await refreshTokenOnError({
        config: { _retry: false },
        response: {
          status: 401,
        },
      });

      expect(mockSetItem).toBeCalled();
      expect(mockRequest).toBeCalled();
    });

    test('отправляет сообщение об ошибке', async () => {
      mockAxiosGet.mockRejectedValue({ message: '' });
      try {
        await refreshTokenOnError({
          config: { _retry: false },
          response: {
            status: 401,
          },
        });
      } catch {
        expect(mockError).toBeCalled();
      }
    });
  });
});
