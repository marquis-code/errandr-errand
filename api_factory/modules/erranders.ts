import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const erranders_api = {
  getStatistics: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/erranders/statistics');
  },

  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/erranders/me');
  },

  toggleOnline: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/erranders/toggle-status');
  },

  getAssignedOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/erranders/orders');
  },
};
