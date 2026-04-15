import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { buildAuthPath, getCurrentRelativeUrl, storePendingAuthRedirect } from '@utils';

import { AuthIntent } from '../utils/authRedirect';
import { useApp } from './useApp';

export const useRequireAuthAction = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuth } = useApp();

  const redirectTo = useMemo(
    () => getCurrentRelativeUrl(location.pathname, location.search, location.hash),
    [location.hash, location.pathname, location.search],
  );

  const redirectToAuth = useCallback(
    (intent: AuthIntent, pathname: '/signin' | '/signup' = '/signin') => {
      storePendingAuthRedirect(redirectTo);
      navigate(
        buildAuthPath(pathname, {
          intent,
          redirectTo,
        }),
      );
    },
    [navigate, redirectTo],
  );

  const runWithAuth = useCallback(
    (intent: AuthIntent, action: () => void | Promise<void>) => {
      if (!isAuth) {
        redirectToAuth(intent);
        return false;
      }

      void action();
      return true;
    },
    [isAuth, redirectToAuth],
  );

  return {
    isAuth,
    redirectTo,
    redirectToAuth,
    runWithAuth,
  };
};
