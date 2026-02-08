import { api } from '@api';
import { useQuery } from '@tanstack/react-query';

export const CURRENT_USER_QUERY_KEY = 'current_user';

export const useCurrentUser = () => {
  return useQuery({
    queryFn: api.getCurrentUser,
    queryKey: [CURRENT_USER_QUERY_KEY],
    select: ({ data }) => data,
  });
};
