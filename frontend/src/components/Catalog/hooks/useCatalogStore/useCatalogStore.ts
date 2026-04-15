import { useQuery } from '@tanstack/react-query';

import { api } from '@api';
import { STALE_TIME } from '@constants';

export const CATALOG_QUERY_KEY = 'catalog';

export const useCatalogQuery = () =>
  useQuery({
    queryKey: [CATALOG_QUERY_KEY],
    staleTime: STALE_TIME,
    queryFn: async () => {
      const response = await api.getCatalogComics();
      return response.data.data;
    },
  });
