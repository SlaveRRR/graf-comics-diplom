import { useQuery } from '@tanstack/react-query';

import { api } from '@api';
import { STALE_TIME } from '@constants';

export const COMIC_READER_QUERY_KEY = 'comic-reader';

export const useComicReaderQuery = (comicId?: string, chapterId?: string) =>
  useQuery({
    queryKey: [COMIC_READER_QUERY_KEY, comicId, chapterId],
    enabled: Boolean(comicId && chapterId),
    staleTime: STALE_TIME,
    queryFn: async () => {
      if (!comicId || !chapterId) {
        throw new Error('Глава не найдена.');
      }

      const response = await api.getComicReader(comicId, chapterId);
      return response.data.data;
    },
  });
