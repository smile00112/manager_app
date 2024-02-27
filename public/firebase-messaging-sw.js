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
//!!!Дублирует пуш сообщение
// messaging.onBackgroundMessage(function(payload) {
//   console.log('Received background message ', payload);
//
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//   };
//
//   self.registration.showNotification(notificationTitle,
//       notificationOptions);
// });


//
// class CustomPushEvent extends Event {
//   constructor(data) {
//     super('push');
//
//     Object.assign(this, data);
//     this.custom = true;
//   }
// }
//
// /*
//  * Overrides push notification data, to avoid having 'notification' key and firebase blocking
//  * the message handler from being called
//  */
// self.addEventListener('push', (e) => {
//   // Skip if event is our own custom event
//   if (e.custom) return;
//
//   // Kep old event data to override
//   const oldData = e.data;
//
//   // Create a new event to dispatch, pull values from notification key and put it in data key,
//   // and then remove notification key
//   const newEvent = new CustomPushEvent({
//     data: {
//       ehheh: oldData.json(),
//       json() {
//         const newData = oldData.json();
//         newData.data = {
//           ...newData.data,
//           ...newData.notification,
//         };
//         delete newData.notification;
//         return newData;
//       },
//     },
//     waitUntil: e.waitUntil.bind(e),
//   });
//
//   // Stop event propagation
//   e.stopImmediatePropagation();
//
//   // Dispatch the new wrapped event
//   dispatchEvent(newEvent);
// });
//
// const messaging = firebase.messaging();
//
// messaging.onBackgroundMessage((payload) => {
//   // console.log('[firebase-messaging-sw.js] Received background message ', payload);
//
//   const { title, body, icon, ...restPayload } = payload.data;
//
//   const notificationOptions = {
//     body,
//     icon: icon || '/icons/firebase-logo.png', // path to your "fallback" firebase notification logo
//     data: restPayload,
//   };
//
//   return self.registration.showNotification(title, notificationOptions);
// });
//
// self.addEventListener('notificationclick', (event) => {
//   // console.log('[firebase-messaging-sw.js] notificationclick ', event);
//
//   // click_action described at https://github.com/BrunoS3D/firebase-messaging-sw.js#click-action
//   if (event.notification.data && event.notification.data.click_action) {
//     self.clients.openWindow(event.notification.data.click_action);
//   } else {
//     self.clients.openWindow(event.currentTarget.origin);
//   }
//
//   // close notification after click
//   event.notification.close();
// });