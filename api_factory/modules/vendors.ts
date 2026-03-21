import { GATEWAY_ENDPOINT, GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const vendors_api = {
  getOnline: () => {
    return GATEWAY_ENDPOINT.get('/vendors/online');
  },

  getStatistics: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/vendors/statistics');
  },

  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/vendors/mine');
  },

  toggleOnline: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/vendors/${id}/toggle-online`);
  },

  updateBusinessHours: (id: string, hours: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/vendors/${id}/business-hours`, { hours });
  },
};
