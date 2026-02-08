import { api } from '@api';
import { CURRENT_USER_QUERY_KEY, useApp, useLocalStorage } from '@hooks';
import { OutletContext } from '@pages';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate, useOutletContext } from 'react-router-dom';

export const useSignInMutation = () => {
  const { setItem } = useLocalStorage();
  const { setAuth } = useApp();
  const { messageApi } = useOutletContext<OutletContext>();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: api.signIn,
    onError: (error: AxiosError<Record<string, string | string[]>>) => {
      messageApi.error(error.message);
    },
    onSuccess: (data) => {
      messageApi.success('Вы успешно вошли!');
      setItem('token', data.data['access_token']);
      setAuth(true);
      queryClient.invalidateQueries([CURRENT_USER_QUERY_KEY]);
      navigate('/');
    },
  });
};
