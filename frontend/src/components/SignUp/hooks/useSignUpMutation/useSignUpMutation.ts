import { AxiosError } from 'axios';
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import { api } from '@api';
import { OutletContext } from '@pages';
import { VerificationEmailResponse } from '@types';
import { getIntentFromSearch, getRedirectFromSearch } from '@utils';

const getErrorMessage = (error: AxiosError<Record<string, string | string[]>>) => {
  const detail = error.response?.data?.detail;

  if (typeof detail === 'string') {
    return detail;
  }

  return error.message;
};

export const useSignUpMutation = () => {
  const { messageApi } = useOutletContext<OutletContext>();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: api.signUp,
    onError: (error: AxiosError<Record<string, string | string[]>>) => {
      messageApi.error(getErrorMessage(error));
    },
    onSuccess: ({ data }: { data: VerificationEmailResponse }) => {
      sessionStorage.setItem(
        `verification-cooldown:${data.email.toLowerCase()}`,
        String(Date.now() + data.retry_after * 1000),
      );
      messageApi.success('Письмо для подтверждения почты отправлено.');
      const params = new URLSearchParams({
        verification: 'pending',
        email: data.email,
        retryAfter: String(data.retry_after),
      });
      const redirect = getRedirectFromSearch(location.search);
      const intent = getIntentFromSearch(location.search);

      if (redirect !== '/') {
        params.set('redirect', redirect);
      }

      if (intent) {
        params.set('intent', intent);
      }

      navigate(`/signin?${params.toString()}`, { replace: true });
    },
  });
};
