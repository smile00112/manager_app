import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {saveNotifToHistory, reLoadOrder, getStatuces, addLog} from '../../../store/orders';
import {getUser, getUserStock, getUserDomain} from '../../../store/users';
import {toast} from 'react-toastify';
import {translateStatus} from "../../../utils/ordersUtils";

// import {reLoadCourier, updateCourier} from '../../../store/couriers';
//import { Notifications } from 'react-push-notification';
//import {ShowOrderNotification} from '../panels/ordersNotification/ordersNotification'
// import addNotification from 'react-push-notification';
// import ShowOrderNotification from "../../../utils/react-push-notification";

const DEBUG = false;
declare global {
    interface window {
        Echo: any;
        Pusher: any;
        Chanel: any;
    }
}

type ToastOptions = {}//чтобы typescript не ругался на seetings

const show_toast = (message: string, type = '') => {
    const seetings = {
        position: "top-right",
        autoClose: 30000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    } as ToastOptions;

    type ? toast[type](message, seetings) : toast(message, seetings);
}

// window['Pusher'].log = (msg) => {
//     console.warn('___Pusher___', msg);
// };
const Soskets = () => {

    const dispatch = useDispatch();
    const userData = useSelector(getUser())
    const orderStatuces = useSelector(getStatuces())

    // https://fkhadra.github.io/react-toastify/introduction/  демки
    // https://unicode-table.com/ru/emoji/  юникоды ээмодзей
    // toast.error('Something was wrong. Try it later');


    const channel = window['Pusher2'].subscribe(userData.domain_name + '_order_operator_' +  userData.id + '_' + userData.stock_id);
    if (DEBUG) console.log('subscribe  ' + userData.domain_name + '_order_operator_' +  userData.id + '_' + userData.stock_id);
    if (DEBUG) console.log(userData);

    // channel.bind_global(function (event, data) {
    //   //  setChanelLog(chanelLog + `\nThe event ${event} was triggered with data ${data}`)
    //    // console.warn(`The event ${event} was triggered with data ${data}`,data, JSON.stringify(data) );
    //    // dispatch(addLog(`\nThe event ${event} was triggered with data ${data}`))
    // })

    channel.bind('NewOrderEvent', function (data) {
        if (DEBUG) console.log('Soskets_pusher Получен новый заказ', data);
        const notif_text = `❗ Получен новый заказ №${data.order.id} ❗`;
        show_toast(notif_text);

        dispatch(saveNotifToHistory(`Новый заказ №${data.order.id}`));
        dispatch(reLoadOrder(data.order.id));

    });

    channel.bind('UpdateOrderEvent', function (data) {
        if (DEBUG) console.log('Soskets_pusher Статус заказа изменён', data);
        //  const notif_text = `❗ Статус заказа №${data.order.id} изменён на «${translateStatus( data.order.status, orderStatuces ) }»❗`;
        const notif_text = `❗ Статус заказа №${data.order.id} изменён на «${data.order.status}»❗`;
        show_toast(notif_text);

        dispatch(saveNotifToHistory(notif_text));
        dispatch(reLoadOrder(data.order.id));

    });


    return (
        <></>
    );

}


export default Soskets;