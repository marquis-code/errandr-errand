importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Try query string params first (from PWA workbox import), fall back to hardcoded values
const urlParams = new URL(location).searchParams;
const firebaseConfig = {
  apiKey: urlParams.get('apiKey') || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
  projectId: urlParams.get('projectId') || 'erranders-493fe',
  messagingSenderId: urlParams.get('messagingSenderId') || '1022790982621',
  appId: urlParams.get('appId') || '1:1022790982621:web:771af2aab7a6e7a200b434',
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png',
    requireInteraction: true // This ensures the notification stays until the vendor clicks it
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
