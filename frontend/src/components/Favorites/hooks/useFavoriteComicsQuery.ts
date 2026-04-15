import { useQuery } from '@tanstack/react-query';

import { api } from '@api';
import { STALE_TIME } from '@constants';

export const FAVORITE_COMICS_QUERY_KEY = 'favorite-comics';

export const useFavoriteComicsQuery = () =>
  useQuery({
    queryKey: [FAVORITE_COMICS_QUERY_KEY],
    staleTime: STALE_TIME,
    queryFn: async () => {
      const response = await api.getFavoriteComics();
      return response.data.data;
    },
  });
