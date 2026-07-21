import { getToken, onMessage } from 'firebase/messaging';
import { useNuxtApp, useRuntimeConfig } from '#app';
import { auth_api } from '@/api_factory/modules/auth';

export const useDispatchNotifications = () => {
  const { $messaging } = useNuxtApp();
  const config = useRuntimeConfig();

  const requestPermissionAndRegister = async () => {
    if (!$messaging) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        // Wait for the PWA service worker to be ready instead of registering a new one
        const registration = await navigator.serviceWorker.ready;
        
        const currentToken = await getToken($messaging, { 
          vapidKey: config.public.firebaseVapidKey || 'BJJs2JX_V36p-9sfug38GwMMGDWSQMObywAkys73EXlJgLEsiQaF6nRMDzVVjdgDb-MHJyw3Q_atT6KaluQN41I',
          serviceWorkerRegistration: registration
        });
        
        if (currentToken) {
          console.log('FCM Token:', currentToken);
          // Send to backend
          await auth_api.updateFcmToken({ token: currentToken });
        }
      }
    } catch (e) {
      console.error('Error getting notification permission:', e);
    }
  };

  const listenForNotifications = () => {
    if (!$messaging) return;
    
    onMessage($messaging, (payload) => {
      console.log('Foreground message received:', payload);
      
      // Play sound
      try {
        const audio = new Audio('/sounds/order-alert.mp3');
        audio.play().catch(e => console.log('Audio play prevented:', e));
      } catch (e) {}
    });
  };

  return {
    requestPermissionAndRegister,
    listenForNotifications
  };
};
