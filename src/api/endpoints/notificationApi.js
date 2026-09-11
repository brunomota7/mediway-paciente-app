// 📁 src/api/endpoints/notificationApi.js
//
// Inbox de notificações do paciente logado. /api/v1/notifications (novo).
//   NT1  GET   /notifications/me?unreadOnly=  -> [{ id, title, message, type, read, createdAt }]
//   NT2  PATCH /notifications/{id}/read        -> 204
//   NT3  DELETE /notifications/{id}            -> 204
// `POST /notifications/user/{userId}` é de ADMIN/MÉDICO/CUIDADOR — não é usado aqui.

import { api } from '../client';
import { NotificationType } from '../../lib/enums';
import { toBrDateTime } from '../../lib/datetime';

export function notificationFromApi(dto) {
  const type = dto?.type ?? null;
  return {
    id: dto?.id ?? null,
    title: dto?.title ?? '',
    message: dto?.message ?? '',
    type,
    typeLabel: type ? NotificationType.label(type) : 'Geral',
    read: Boolean(dto?.read),
    createdAt: dto?.createdAt ?? null,
    createdAtLabel: dto?.createdAt ? toBrDateTime(dto.createdAt) : '',
    raw: dto ?? null,
  };
}

export const notificationApi = {
  /** NT1 — inbox do paciente logado. */
  listMine: async ({ unreadOnly = false } = {}) => {
    const { data } = await api.get('/notifications/me', { params: { unreadOnly } });
    return Array.isArray(data) ? data.map(notificationFromApi) : [];
  },

  /** NT2 */
  markRead: (id) => api.patch(`/notifications/${id}/read`),

  /** NT3 */
  remove: (id) => api.delete(`/notifications/${id}`),
};

export default notificationApi;
