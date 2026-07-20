import { initializeApp } from 'firebase/app';
import { getMessaging, onMessage } from 'firebase/messaging';
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
  };

  const app = initializeApp(firebaseConfig);

  // Messaging is only available in the browser
  if (process.client) {
    try {
      const messaging = getMessaging(app);
      
      // We also set up the onMessage listener here globally so we can emit custom events
      onMessage(messaging, (payload) => {
        console.log('[Firebase Plugin] Received foreground message:', payload);
        // You could emit an event here if you had an event bus, but returning messaging is enough
      });

      return {
        provide: {
          messaging
        }
      };
    } catch (e) {
      console.error('Firebase messaging initialization error', e);
    }
  }

  return {
    provide: {
      messaging: null
    }
  };
});
