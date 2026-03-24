import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const notifications_api = {
  getAll: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/notifications');
  },

  getUnreadCount: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/notifications/unread-count');
  },

  markAsRead: (notificationId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/notifications/${notificationId}/read`);
  },

  markAllAsRead: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/notifications/read-all');
  },
};
