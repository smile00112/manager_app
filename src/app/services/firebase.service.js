//import firebase from 'firebase/compat/app';
import {getMessaging, getToken, onMessage} from "firebase/messaging";
import {initializeApp} from 'firebase/app';
import httpService from './http.service';
import ConfigJson from '../config.json'
import showToast from '../utils/message';
import localStorageService from './localStorage.service';

const DEBUG = false;

const firebaseApp = initializeApp(ConfigJson.firebaseConfig);
export const messaging = getMessaging(firebaseApp);
export const getClientToken = () => {
    return getToken(messaging, {vapidKey: ConfigJson.firebase_key}).then((currentToken) => {
        if (currentToken) {
            if (DEBUG) console.log('current token for client: ', currentToken);
            // setTokenFound(true);
            // Track the token -> client mapping, by sending to backend server
            // show on the UI that permission is secured
            //saveToken
            httpService.post(`/wp-json/manager/fcm`, {
                fcm: currentToken,
                token: localStorageService.getAccessToken()
            })

                .then(function (response) {
                    if (DEBUG) console.log(response);
                    //showToast('Уведомения включены', 'info')

                })
                .catch(function (error) {

                    if (DEBUG) console.warn(error);
                    return false;
                })
            return true;
        } else {
            if (DEBUG) console.log('No registration token available. Request permission to generate one.')
            showToast('Похоже у Вас заблокированы уведомления с данного адреса', 'warn')
            return false;
            //  setTokenFound(false);
            // shows on the UI that permission is required
        }
    }).catch((err) => {
        if (DEBUG) console.log('An error occurred while retrieving token. ', err);
        showToast('Похоже у Вас заблокированы уведомления с данного адреса', 'warn')
        return false;
        // catch error while creating client token
    });

}

export const getNotificationStatus = () => {
    return getToken(messaging, {vapidKey: ConfigJson.firebase_key}).then((currentToken) => {
        if (currentToken) {
            if (DEBUG) console.log('Get token');
            // showToast('Уведомения включены', 'info')
            return true;
        } else {
            if (DEBUG) console.log('No registration token available. Request permission to generate one.');
            //showToast('Похоже у Вас заблокированы уведомления с данного адреса', 'warn')
            return false;
        }
    }).catch((err) => {
        //showToast('Похоже у Вас заблокированы уведомления с данного адреса', 'warn')
        if (DEBUG) console.log('An error occurred while retrieving token. ', err);
        return false;
    });
}
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });