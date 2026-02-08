import { render, waitFor } from '@testing-library/react';
import { AppProvider } from './AppProvider';

const mockInvalidateQueries = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: () => mockInvalidateQueries(),
  }),
}));

const mockGetItem = vi.fn();
const mockSetItem = vi.fn();

vi.mock('@hooks', () => ({
  CURRENT_USER_QUERY_KEY: '',
  useLocalStorage: () => ({
    getItem: () => mockGetItem(),
    setItem: () => mockSetItem(),
  }),
  useCurrentUser: () => ({
    data: {},
  }),
}));

vi.mock('@api', () => ({
  api: {
    refreshToken: () => ({
      status: 200,
      data: {
        access_token: '',
      },
    }),
  },
}));

vi.mock('@utils', () => ({
  getIsTokenExpired: () => true,
}));

describe('AppProvider', () => {
  test('проверка обновления токена', async () => {
    mockGetItem.mockReturnValue('token');

    render(<AppProvider />);

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalled();
    });
  });
});
