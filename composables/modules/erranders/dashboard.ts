import { ref } from 'vue';
import { erranders_api } from '@/api_factory/modules/erranders';
import { orders_api } from '@/api_factory/modules/orders';
import { useUser } from '../auth/user';

export const useErranderDashboard = () => {
  const { user } = useUser();
  const loading = ref(true);
  const stats = ref([
    { label: 'Today Earning', value: '₦0' },
    { label: 'Completed', value: '0' },
    { label: 'Rating', value: '5.0' },
    { label: 'Status', value: 'Offline' },
  ]);
  const availableOrders = ref<any[]>([]);

  const fetchDashboardData = async () => {
    loading.value = true;
    try {
      const erranderRes = await erranders_api.getProfile();
      if (erranderRes && (erranderRes as any).type !== 'ERROR' && erranderRes.data) {
        const errander = erranderRes.data;

        stats.value = [
          { label: 'Total Earnings', value: `₦${errander.totalEarnings?.toLocaleString() || '0'}` },
          { label: 'Completed', value: errander.totalDeliveries?.toString() || '0' },
          { label: 'Rating', value: `⭐ ${errander.rating?.toFixed(1) || '5.0'}` },
          { label: 'Status', value: errander.status === 'available' ? '🟢 Online' : '🔴 Offline' },
        ];
      }

      const ordersRes = await orders_api.getErranderOrders();
      if (ordersRes && (ordersRes as any).type !== 'ERROR' && ordersRes.data) {
        availableOrders.value = ordersRes.data;
      } else {
        availableOrders.value = [];
      }
    } catch (e) {
      console.error('Errander dashboard data fetch failed', e);
    } finally {
      loading.value = false;
    }
  };

  const toggleStatus = async () => {
    try {
      await erranders_api.toggleOnline();
      await fetchDashboardData();
    } catch (e) {}
  };

  const acceptOrder = async (orderId: string) => {
    try {
      await orders_api.updateOrderStatus(orderId, 'picked_up'); // Simplified for now
      await fetchDashboardData();
    } catch (e) {}
  };

  return { loading, stats, availableOrders, fetchDashboardData, toggleStatus, acceptOrder };
};
