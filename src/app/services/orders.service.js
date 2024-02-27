//import { BookingType } from '../types/types';
import httpService from './http.service';
import localStorageService from './localStorage.service';
import configFile from '../config.json';
const orderEndPoint = 'wp-json/wc/v3/orders';
const restApiEndPoint = 'wp-json';
const satucesEndPoint = '/wp-json/systeminfo/v1/order/status/map';
const accessToken = localStorageService.getAccessToken();

///wp-json/wc/v3/orders?per_page=55&status=processing&page=1&consumer_key=ck_8e9043f849e95e6d003c3cc2474fc22b2ed01eec&consumer_secret=cs_74c746f821c405606c0950997a33b194ffc06876&token={{my_token}}
const urlData = `&per_page=5&page=1&consumer_key=${process.env.REACT_APP_CONSUMER_KEY}&consumer_secret=&${process.env.REACT_APP_CONSUMER_SECRET}`;//&token=${accessToken}`
const ordersService = {
  getAll: async (status, page = 1) => {
    const statusQuery = status ? `status=${status}` : '';
    const pageQuery = page ? `&page=${page}` : 'page=1';
    const per_pageQuery = configFile.orders_perpage ? `&per_page=${configFile.orders_perpage}` : 'per_page=1';
    const { data } = await httpService.get(orderEndPoint + `?` + statusQuery + pageQuery + per_pageQuery + `&token=${localStorageService.getAccessToken()}`);
    return { status: status, data: data };
  },
  getStatuces: async () => {
    const { data } = await httpService.get(satucesEndPoint);
    return { data: data };
  },
  create: async (payload) => {
    const { data } = await httpService.post(orderEndPoint, payload);
    return data;
  },
  changeStatus: async (payload) => {
    const { data } = await httpService.post(restApiEndPoint + `/manager/order/status`, payload);
    return data;
  },
  remove: async (id) => {
    await httpService.delete(orderEndPoint + '/' + id);
    return id;
  },
  getById: async (id) => {

    console.error('ORDER getById', id);
    const { data } = await httpService.get(orderEndPoint + '/' + id);
    return data;
  },
  getUserOrders: async (userId) => {
    const { data } = await httpService.get(orderEndPoint, {
      params: {
        orderBy: 'userId',
        equalTo: `${userId}`,
      },
    });
    return data;
  },
  update: async (payload) => {
    const { data } = await httpService.post(orderEndPoint + '/' + payload.id , payload);
    return data;
  },
  orderToCourier: async (payload) => {
    console.log('orderToCourier_service', payload)
    const { data } = await httpService.get(orderEndPoint + '/' + payload.order_id + '/to_courier/' + payload.courier_id, payload);
    return data;
  },
  // getRoomBookings: async (roomId) => {
  //   const { data } = await httpService.get(orderEndPoint, {
  //     params: {
  //       orderBy: 'roomId',
  //       equalTo: `${roomId}`,
  //     },
  //   });
  //   return data;
  // },
};

export default ordersService;
