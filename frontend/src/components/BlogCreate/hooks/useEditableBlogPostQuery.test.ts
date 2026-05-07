import { QueryClientProvider } from '@test-utils';
import { AxiosResponse } from 'axios';
import { renderHook, waitFor } from '@testing-library/react';

import { api } from '@api';

import { useEditableBlogPostQuery } from './useEditableBlogPostQuery';

vi.mock('@api', () => ({
  api: {
    getEditableBlogPost: vi.fn(),
  },
}));

const mockApi = vi.mocked(api);

describe('useEditableBlogPostQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('does not stay in loading state when postId is missing', () => {
    const { result } = renderHook(() => useEditableBlogPostQuery(), {
      wrapper: QueryClientProvider,
    });

    expect(result.current.isLoading).toBe(false);
    expect(mockApi.getEditableBlogPost).not.toHaveBeenCalled();
  });

  test('loads editable post when postId is provided', async () => {
    const apiResponse = {
      data: {
        data: {
          id: 5,
          title: 'Draft post',
        },
      },
      status: 200,
    } as AxiosResponse;

    mockApi.getEditableBlogPost.mockResolvedValue(apiResponse);

    const { result } = renderHook(() => useEditableBlogPostQuery('5'), {
      wrapper: QueryClientProvider,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockApi.getEditableBlogPost).toHaveBeenCalledWith('5');
    expect(result.current.data).toMatchObject({
      id: 5,
      title: 'Draft post',
    });
  });
});
