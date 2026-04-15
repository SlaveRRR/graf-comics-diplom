import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@api';
import { ComicCommentCreatePayload, ComicDetailsResponse } from '@types';
import { CATALOG_QUERY_KEY } from '@components/Catalog/hooks/useCatalogStore/useCatalogStore';
import { COMIC_READER_QUERY_KEY } from '@components/ComicReader/hooks/useComicReaderQuery';

import { COMIC_DETAILS_QUERY_KEY } from './useComicDetailsQuery';

export const useComicCommentMutation = (comicId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ComicCommentCreatePayload) => {
      if (!comicId) {
        throw new Error('Комикс не найден.');
      }

      const response = await api.createComicComment(comicId, payload);
      return response.data.data;
    },
    onSuccess: (comment) => {
      queryClient.setQueryData<ComicDetailsResponse | undefined>([COMIC_DETAILS_QUERY_KEY, comicId], (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          comments: [comment, ...current.comments],
          commentsCount: current.commentsCount + 1,
        };
      });

      queryClient.invalidateQueries([COMIC_DETAILS_QUERY_KEY, comicId]);
      queryClient.invalidateQueries([COMIC_READER_QUERY_KEY, comicId]);
      queryClient.invalidateQueries([CATALOG_QUERY_KEY]);
    },
  });
};
