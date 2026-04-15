import { BACKEND_URL } from '@constants';

import { storePendingAuthRedirect } from '../authRedirect';

type SocialProvider = 'google' | 'yandex' | 'vk';

export const startHeadlessSocialAuth = (provider: SocialProvider, redirectTo?: string | null) => {
  storePendingAuthRedirect(redirectTo);
  window.location.href = `${BACKEND_URL}/api/v1/social/${provider}/start/`;
};
