importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// These should ideally be replaced with actual env vars during build, 
// but service workers can be tricky. Often, people hardcode them or use a query string trick.
// For now, we will assume you inject these or set them via a script.
// A common approach is to just use standard messaging config here.
firebase.initializeApp({
  apiKey: new URL(location).searchParams.get('apiKey'),
  projectId: new URL(location).searchParams.get('projectId'),
  messagingSenderId: new URL(location).searchParams.get('messagingSenderId'),
  appId: new URL(location).searchParams.get('appId'),
});

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
