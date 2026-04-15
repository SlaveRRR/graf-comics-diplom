import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@api';
import { ComicReaderResponse } from '@types';

import { COMIC_READER_QUERY_KEY } from './useComicReaderQuery';

export const useComicReadingProgressMutation = (comicId?: string, chapterId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lastPage: number) => {
      if (!comicId || !chapterId) {
        throw new Error('Глава не найдена.');
      }

      const response = await api.updateComicReadingProgress(comicId, chapterId, lastPage);
      return response.data.data;
    },
    onSuccess: (progress) => {
      queryClient.setQueryData<ComicReaderResponse | undefined>(
        [COMIC_READER_QUERY_KEY, comicId, chapterId],
        (current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,
            progress,
          };
        },
      );
    },
  });
};
