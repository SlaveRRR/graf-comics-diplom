import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@api';
import { NotificationListResponse } from '@types';

import { NOTIFICATIONS_QUERY_KEY } from './useNotificationsQuery';

export const useDeleteNotificationsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      if (!ids.length) {
        throw new Error('Выберите хотя бы одно уведомление.');
      }

      const response = await api.deleteNotifications({ ids });
      return response.data.data;
    },
    onSuccess: (_, ids) => {
      queryClient.setQueryData<NotificationListResponse | undefined>([NOTIFICATIONS_QUERY_KEY], (currentData) => {
        if (!currentData) {
          return currentData;
        }

        const idSet = new Set(ids);
        const items = currentData.items.filter((item) => !idSet.has(item.id));

        return {
          unreadCount: items.filter((item) => !item.isRead).length,
          items,
        };
      });
    },
  });
};
