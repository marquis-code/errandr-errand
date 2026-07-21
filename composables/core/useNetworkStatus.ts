import { ref } from 'vue';

// Global state so multiple components hooking into it share the same state
const isOnline = ref(true);
const isSlowNetwork = ref(false);

let slowNetworkTimeout: NodeJS.Timeout | null = null;

export const useNetworkStatus = () => {
  const updateOnlineStatus = () => {
    isOnline.value = navigator.onLine;
    if (isOnline.value) {
      // Clear slow network when we come back online
      isSlowNetwork.value = false;
    }
  };

  const recordSlowNetwork = () => {
    // Only set to slow if we're actually online. If offline, offline takes precedence.
    if (navigator.onLine) {
      isSlowNetwork.value = true;
      
      // Auto-clear slow network warning after 15 seconds unless re-triggered
      if (slowNetworkTimeout) clearTimeout(slowNetworkTimeout);
      slowNetworkTimeout = setTimeout(() => {
        isSlowNetwork.value = false;
      }, 15000);
    }
  };

  const initNetworkListeners = () => {
    if (typeof window === 'undefined') return;
    
    isOnline.value = navigator.onLine;
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  };

  const destroyNetworkListeners = () => {
    if (typeof window === 'undefined') return;
    
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
    if (slowNetworkTimeout) clearTimeout(slowNetworkTimeout);
  };

  return {
    isOnline,
    isSlowNetwork,
    recordSlowNetwork,
    initNetworkListeners,
    destroyNetworkListeners
  };
};
