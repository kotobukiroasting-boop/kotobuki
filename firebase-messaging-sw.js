// Kotobuki焙煎チャット Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBHDzP3-BPYr1T9yBFmHNzCE52umgZBTzQ",
  authDomain: "chat-6d912.firebaseapp.com",
  projectId: "chat-6d912",
  storageBucket: "chat-6d912.firebasestorage.app",
  messagingSenderId: "488783011532",
  appId: "1:488783011532:web:5c522e8b73676c02b5ec69"
});

const messaging = firebase.messaging();

// バックグラウンド通知受信
messaging.onBackgroundMessage((payload) => {
  console.log('バックグラウンド通知受信:', payload);
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/kotobuki/icon-192.png',
    badge: '/kotobuki/icon-192.png',
    vibrate: [200, 100, 200],
    tag: 'kotobuki-chat'
  });
});
