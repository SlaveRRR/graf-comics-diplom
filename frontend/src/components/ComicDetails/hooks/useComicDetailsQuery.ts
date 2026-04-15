import { useQuery } from '@tanstack/react-query';

import { api } from '@api';
import { STALE_TIME } from '@constants';

export const COMIC_DETAILS_QUERY_KEY = 'comic-details';

export const useComicDetailsQuery = (comicId?: string) =>
  useQuery({
    queryKey: [COMIC_DETAILS_QUERY_KEY, comicId],
    enabled: Boolean(comicId),
    staleTime: STALE_TIME,
    queryFn: async () => {
      if (!comicId) {
        throw new Error('Комикс не найден.');
      }

      const response = await api.getComicDetails(comicId);
      return response.data.data;
    },
  });
