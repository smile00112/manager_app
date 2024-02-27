import axios from 'axios';
//import { toast } from 'react-toastify';
import configFile from '../config.json';
//import authService from './auth.service';
import localStorageService, {removeAuthData} from './localStorage.service';
import history from '../utils/history';
//import * as PusherPushNotifications from "@pusher/push-notifications-web";
import Pusher from "pusher-js";

import Echo from 'laravel-echo';
//window.Pusher = require('pusher-js');



/* Сокеты */
// import Echo from 'laravel-echo';

// window.Pusher = require('pusher-js');
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.REACT_APP_PUSHER_KEY,
//     cluster: 'eu',
//     forceTLS: true
// });
//import ShowOrderNotification from "../utils/react-push-notification";
const pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
    cluster: "eu",
    //ignoreNullOrigin: true,
    // enabledTransports: ['ws'],
    //  disabledTransports: ['wss', 'sockjs', 'xhr_polling', 'xhr_streaming'],
    // activityTimeout: 10000
});
pusher.connection.bind( 'error', function( err ) {
    if( err.data.code === 4004 ) {
        alert('Over limit!');
    }
});

window.Pusher2 = pusher;
//window.Pusher2.connection.strategy.transports.ws.transport.manager.livesLeft = Infinity;

// window.Pusher = require('pusher-js');
// window.Echo = new Echo({
//     broadcaster: 'pusher',
//     key: process.env.REACT_APP_PUSHER_KEY,
//     cluster: 'eu',
//     forceTLS: true
// });

// const beamsClient = new PusherPushNotifications.Client({
//     //получать в https://dashboard.pusher.com/beams/
//     instanceId: "e7c89e49-bd0d-4753-bf78-160b6d7765d4",
//     /*
//     * сообщение
//     * curl -H "Content-Type: application/json" \
//      -H "Authorization: Bearer 33259EEAAA10B68BD3AD911E69E6CB7E3A64A189B11A0ADE7DBDCBCBB50B0DA8" \
//      -X POST "https://e7c89e49-bd0d-4753-bf78-160b6d7765d4.pushnotifications.pusher.com/publish_api/v1/instances/e7c89e49-bd0d-4753-bf78-160b6d7765d4/publishes" \
//      -d '{"interests":["hello"],"web":{"notification":{"title":"Hello","body":"Hello, world!"}}}'
//     * */
// });

/*регистрация клиента на пуши*/
// beamsClient
//     .start()
//     .then((beamsClient) => beamsClient.getDeviceId())
//     .then((deviceId) =>
//         console.log("Successfully registered with Beams. Device ID:", deviceId)
//     )
//     .catch(console.error);


/****Сокеты *****/

const DEBUG = false;
const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

http.interceptors.request.use(
  async function (config) {
    const expiresDate = localStorageService.getTokenExpiresDate();
    const refreshToken = localStorageService.getRefreshToken();
    const isExpired = refreshToken && Number(expiresDate) < Date.now();

    // if (configFile.isFireBase) {
    //   const containSlash = /\/$/gi.test(String(config.url));
    //   config.url = (containSlash ? config.url?.slice(0, -1) : config.url) + '.json';

    //   if (isExpired) {
    //     const data = await authService.refresh();
    //     localStorageService.setTokens({
    //       expiresIn: data.expires_in,
    //       accessToken: data.id_token,
    //       userId: data.user_id,
    //       refreshToken: data.refresh_token,
    //     });
    //   }
    //   const accessToken = localStorageService.getAccessToken();
    //   if (accessToken) {
    //     config.params = { ...config.params, auth: accessToken };
    //   }
    // } else 
    {
      if (isExpired) {
        if(DEBUG) console.warn('http.service  authService.refresh')
        // const data = await authService.refresh();
        // localStorageService.setTokens(data);
        localStorageService.removeAuthData();
        history.push(process.env.PUBLIC_URL)
      }
      const accessToken = localStorageService.getAccessToken();
      if (accessToken) {
        config.headers = { ...config.headers, Authorization: `Bearer ${accessToken}` };
      }
      // config.headers['Accept'] = '*/*';
      // config.headers['Content-Type'] = 'text/plain';
      // config.headers['Host'] = 'www.yeremyan.delivery';

       /*
            *
            *        config.headers = {
            'Accept': '/',
            'Origin': 'http://localhost:3001',
            'Host': 'www.yeremyan.delivery',
            'Content-Type': 'text/plain;charset=UTF-8',
        };
        * */
    }
    if(DEBUG) console.warn('http.service__2');
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function transformData(data) {
  return data && !data._id
    ? Object.keys(data).map(key => ({
        ...data[key],
      }))
    : data;
}

http.interceptors.response.use(
  res => {
    if (configFile.isFireBase) {
      res.data = { content: transformData(res.data) };
    }
    res.data = { content: res.data };
    return res;
  },
  function (error) {
    const expectedErrors = error.response && error.response.status >= 400 && error.response.status < 500;
    if (!expectedErrors) {
      if(DEBUG) console.log(error);
      //toast.error('Something was wrong. Try it later');
    }
    return Promise.reject(error);
  }
);

const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete,
  patch: http.patch,
};

export default httpService;
