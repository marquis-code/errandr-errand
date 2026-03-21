import { erranders_api } from "@/api_factory/modules/erranders";
import { useLoader } from "@/composables/core/useLoader";

export const useErranderOrders = () => {
  const loading = ref(false);
  const orders = ref<any[]>([]);

  const fetchAssignedOrders = async () => {
    loading.value = true;
    try {
      const res = await erranders_api.getAssignedOrders();
      orders.value = res.data;
    } finally {
      loading.value = false;
    }
  };

  return { loading, orders, fetchAssignedOrders };
};

export const useErranderStatus = () => {
  const { startLoading, stopLoading } = useLoader();

  const toggleStatus = async () => {
    startLoading('Changing availability...');
    try {
      await erranders_api.toggleStatus();
    } finally {
      stopLoading();
    }
  };

  return { toggleStatus };
};
