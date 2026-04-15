import { useNavigate, useOutletContext } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@api';
import { LS_ACCESS_TOKEN } from '@constants';
import { CURRENT_USER_QUERY_KEY, useApp, useLocalStorage } from '@hooks';
import { OutletContext } from '@pages/LayoutPage/types';

export const useLogoutMutation = () => {
  const { setIsAuth } = useApp();
  const { removeItem } = useLocalStorage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { messageApi } = useOutletContext<OutletContext>();

  const finalizeLogout = () => {
    removeItem(LS_ACCESS_TOKEN);
    setIsAuth(false);
    queryClient.removeQueries([CURRENT_USER_QUERY_KEY]);
    queryClient.removeQueries(['account']);
    queryClient.removeQueries(['favorite-comics']);
    navigate('/', { replace: true });
  };

  return useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      finalizeLogout();
      messageApi.success('Вы вышли из аккаунта.');
    },
    onError: () => {
      finalizeLogout();
    },
  });
};
