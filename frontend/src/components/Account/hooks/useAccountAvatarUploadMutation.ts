import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@api';
import { CURRENT_USER_QUERY_KEY } from '@hooks';
import { USER_PROFILE_QUERY_KEY } from '@components/Profile/hooks/useUserProfileQuery';

import { ACCOUNT_QUERY_KEY } from './useAccountQuery';

const getAvatarUploadPayload = (file: File) => ({
  filename: file.name,
  content_type: file.type || 'application/octet-stream',
});

export const useAccountAvatarUploadMutation = (userId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const configResponse = await api.getAccountAvatarUploadConfig(getAvatarUploadPayload(file));
      const config = configResponse.data.data;

      await api.uploadFile(config.file.upload_url, file);

      const confirmResponse = await api.confirmAccountAvatarUpload({
        avatarDraftId: config.avatarDraftId,
      });

      return confirmResponse.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([CURRENT_USER_QUERY_KEY]);
      queryClient.invalidateQueries([ACCOUNT_QUERY_KEY]);

      if (userId) {
        queryClient.invalidateQueries([USER_PROFILE_QUERY_KEY, userId]);
      }
    },
  });
};
