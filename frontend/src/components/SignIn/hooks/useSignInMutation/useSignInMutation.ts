import { AxiosError } from 'axios';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@api';
import { CURRENT_USER_QUERY_KEY, useApp, useLocalStorage } from '@hooks';
import { OutletContext } from '@pages';
import { consumePendingAuthRedirect, getRedirectFromSearch } from '@utils';

const getErrorMessage = (error: AxiosError<Record<string, string | string[]>>) => {
  const detail = error.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  return error.message;
};

export const useSignInMutation = () => {
  const { setItem } = useLocalStorage();
  const { setIsAuth } = useApp();
  const { messageApi } = useOutletContext<OutletContext>();
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: api.signIn,
    onError: (error: AxiosError<Record<string, string | string[]>>) => {
      messageApi.error(getErrorMessage(error));
    },
    onSuccess: (data) => {
      messageApi.success('Вы успешно вошли!');
      setItem('token', data.data['access_token']);
      setIsAuth(true);
      queryClient.invalidateQueries([CURRENT_USER_QUERY_KEY]);
      navigate(consumePendingAuthRedirect() || getRedirectFromSearch(location.search), { replace: true });
    },
  });
};
