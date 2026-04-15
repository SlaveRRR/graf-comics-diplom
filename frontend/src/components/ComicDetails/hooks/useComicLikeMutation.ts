import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@api';
import { ComicDetailsResponse } from '@types';
import { CATALOG_QUERY_KEY } from '@components/Catalog/hooks/useCatalogStore/useCatalogStore';
import { COMIC_READER_QUERY_KEY } from '@components/ComicReader/hooks/useComicReaderQuery';

import { COMIC_DETAILS_QUERY_KEY } from './useComicDetailsQuery';

export const useComicLikeMutation = (comicId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!comicId) {
        throw new Error('Комикс не найден.');
      }

      const response = await api.toggleComicLike(comicId);
      return response.data.data;
    },
    onSuccess: (payload) => {
      queryClient.setQueryData<ComicDetailsResponse | undefined>([COMIC_DETAILS_QUERY_KEY, comicId], (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          isLiked: payload.isActive,
          likesCount: payload.count,
        };
      });

      queryClient.invalidateQueries([COMIC_DETAILS_QUERY_KEY, comicId]);
      queryClient.invalidateQueries([COMIC_READER_QUERY_KEY, comicId]);
      queryClient.invalidateQueries([CATALOG_QUERY_KEY]);
    },
  });
};
