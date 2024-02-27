// import httpService from "./http.service";

import {ShowOrderNotification} from "../utils/react-push-notification";
import {reLoadOrder, saveNotifToHistory} from "../store/orders";

const notificationService = {
    // subscribe: async (payload) => {
    //    return window['Pusher'].subscribe(payload.domain+'_order_operator_'+payload.stock);
    // },
    subscribe: (payload) => {
        return window['Pusher'].subscribe(payload.domain+'_order_operator_'+payload.stock);
    },
    subscribeMainChanel: (payload) => {
        return window['Pusher'].subscribe(payload.domain+'_channel_'+payload.stock);
    },
    // chanelBind: async (chanel, callback) => {
    //
    // }
    // create: async (payload) => {
    //     const {data} = await httpService.post(couriersEndPoint, payload);
    //     return data;
    // },
}

    export default notificationService;