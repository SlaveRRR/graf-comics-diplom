import { api } from '@api';
import { QueryClientProvider } from '@test-utils';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AxiosResponse } from 'axios';
import { useSignUpMutation } from './useSignUpMutation';

const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: () => mockInvalidateQueries(),
    }),
  };
});

const mockSucces = vi.fn();
const mockError = vi.fn();

const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useOutletContext: () => ({
    messageApi: {
      success: () => mockSucces(),
      error: () => mockError(),
    },
  }),
  useNavigate: () => mockNavigate,
}));

vi.mock('@api', () => ({
  api: {
    signUp: vi.fn(),
  },
}));

const mockSetItem = vi.fn();

const mockSetAuth = vi.fn();

vi.mock('@hooks', async (importOriginal) => {
  const actual: object = await importOriginal();
  return {
    ...actual,
    useLocalStorage: () => ({
      setItem: () => mockSetItem(),
    }),
    useApp: () => ({
      setAuth: () => mockSetAuth(),
    }),
  };
});

const mockApi = vi.mocked(api);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('useSignUpMutation', () => {
  test('проверка работы хука при успешной мутации', async () => {
    const apiResponse = { data: { access_token: '' }, status: 200 } as AxiosResponse;

    mockApi.signUp.mockResolvedValue(apiResponse);

    const { result } = renderHook(() => useSignUpMutation(), {
      wrapper: QueryClientProvider,
    });

    await act(async () => {
      await result.current.mutateAsync({ username: 'test', password: 'test', email: '' });
    });

    await waitFor(async () => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();

    expect(mockSucces).toBeCalled();
    expect(mockSetItem).toBeCalled();
    expect(mockSetAuth).toBeCalled();
    expect(mockInvalidateQueries).toBeCalled();
    expect(mockNavigate).toBeCalled();
  });

  test('проверка работы хука при ошибке', async () => {
    const { result } = renderHook(() => useSignUpMutation(), {
      wrapper: QueryClientProvider,
    });

    const apiResponse = { data: undefined, status: 500 } as AxiosResponse;

    mockApi.signUp.mockRejectedValue(apiResponse);

    await act(async () => {
      try {
        await result.current.mutateAsync({ username: 'test', password: 'test', email: '' });
      } catch {
        await waitFor(() => {
          expect(mockError).toBeCalled();
        });
      }
    });
  });
});
