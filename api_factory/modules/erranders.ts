import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const erranders_api = {
  getStatistics: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/errandr/earnings');
  },

  getProfile: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/errandr/me');
  },

  toggleOnline: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/errandr/toggle-status');
  },

  getAssignedOrders: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/orders/errander');
  },

  getEarnings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/errandr/earnings');
  },
};
