//import { UserType } from '../types/types';
import httpService from './http.service';
import localStorageService from './localStorage.service';

const userEndpoint = 'user';
const userInfoEndpoint = '/wp-json/manager/info';
const accessToken = localStorageService.getAccessToken();

const userService = {
  getInfo: async () => {
    const { data } = await httpService.get(userInfoEndpoint + `?token=${localStorageService.getAccessToken()}`);
    return data;
  },
  getAll: async () => {
    const { data } = await httpService.get(userEndpoint);
    return data;
  },
  create: async (payload) => {
    const { data } = await httpService.put(userEndpoint + '/' + payload._id, payload);
    return data;
  },
  getById: async (id) => {
    const { data } = await httpService.get(userEndpoint + '/' + id);
    return data;
  },
  getCurrentUser: async () => {
    const { data } = await httpService.get(userEndpoint + '/' + localStorageService.getUserId());
    return data;
  },
  updateUserData: async (payload) => {
    const { data } = await httpService.patch(userEndpoint + '/' + localStorageService.getUserId(), payload);
    return data;
  },
};

export default userService;
