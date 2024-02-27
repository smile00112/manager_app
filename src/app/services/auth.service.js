//import axios from 'axios';
import localStorageService from './localStorage.service';
//import config from '../config.json';
import httpService from './http.service';

// const httpAuth = axios.create({
//   baseURL: process.env.REACT_APP_API_URL+`/wp-json/manager/`,
//   params: {
//     key: process.env.REACT_APP_FIREBASE_KEY,
//   },
//   // headers: {
//   //   "Access-Control-Allow-Origin": "*",
//   // },
// });
//axios.defaults.baseURL = process.env.REACT_APP_API_URL+`/wp-json/manager/`
const authService = {
  signUp: async (payload) => {
    console.log('signUp')
    const { data } = await httpService.post(`/wp-json/manager/signUp`, payload);
    return data;
  },
  signIn: async ({ login, password }) => {
    console.log('signIn')
    const response = await httpService.post(`/wp-json/manager/token`, {
      login,
      password,
      returnSecureToken: true,
    });

    return response;
  },
  refresh: async () => {
    console.log('refresh')
    const { data } = await httpService.post('refresh_token', {
      grant_type: 'refresh_token',
      refresh_token: localStorageService.getRefreshToken(),
    });
    
    return data;
  },
};

export default authService;
