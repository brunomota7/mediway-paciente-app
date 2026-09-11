// 📁 src/hooks/useNotifications.js
//
// Inbox de notificações do paciente logado — key ['notifications', { unreadOnly }].

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '../api/endpoints/notificationApi';
import { useAuth } from '../auth/useAuth';

export const notificationKeys = {
  all: ['notifications'],
  list: (unreadOnly) => ['notifications', { unreadOnly: !!unreadOnly }],
};

export function useNotifications({ unreadOnly = false } = {}) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: notificationKeys.list(unreadOnly),
    queryFn: () => notificationApi.listMine({ unreadOnly }),
    enabled: isAuthenticated,
    staleTime: 15_000,
  });
}

function useInvalidateAll() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: notificationKeys.all });
}

export function useMarkNotificationRead() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id) => notificationApi.markRead(id),
    onSuccess: invalidate,
  });
}

export function useRemoveNotification() {
  const invalidate = useInvalidateAll();
  return useMutation({
    mutationFn: (id) => notificationApi.remove(id),
    onSuccess: invalidate,
  });
}

export default useNotifications;
