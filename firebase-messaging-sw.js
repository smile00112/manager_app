// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyByROuVNw_rWn1yp3LSKrNwX67Wjdj4Qao",
  authDomain: "wc-orders-manager.firebaseapp.com",
  projectId: "wc-orders-manager",
  storageBucket: "wc-orders-manager.appspot.com",
  messagingSenderId: "1021092625448",
  appId: "1:1021092625448:web:39ffe899d479b64650091d"
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});