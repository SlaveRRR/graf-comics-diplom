import { useQuery } from '@tanstack/react-query';

import { api } from '@api';
import { STALE_TIME } from '@constants';
import { convertIdNamedObjectToSelectOption } from '@utils';
import { SelectOption } from '@utils/select/types';

export const TAXONOMY_PLATFORM_QUERY_KEY = 'taxonomy';

export const usePlatformTaxonomy = () =>
  useQuery({
    queryFn: api.getPlatformTaxonomy,
    queryKey: [TAXONOMY_PLATFORM_QUERY_KEY],
    staleTime: STALE_TIME,
    select: ({ data }) => {
      const mappedTaxonomy = convertIdNamedObjectToSelectOption({
        genres: data.data.genres,
        tags: data.data.tags,
      });

      const ageRatings: SelectOption[] = data.data.ageRatings.map((item) => ({
        value: item.value,
        label: item.label,
        description: item.description,
      }));

      return {
        ...mappedTaxonomy,
        ageRatings,
      };
    },
  });
