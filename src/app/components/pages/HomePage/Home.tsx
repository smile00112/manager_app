import React, {useCallback, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../../store/createStore';
//import { getIsLoggedIn } from '../../../store/users';
import {
    getOrders,
    getActiveOrder,
    seOrderActive,
    getOrdersLoadingStatus,
    getOrdersLoadingMoreStatus,
    enableModeSelectCourier,
    disableModeSelectCourier,
    orderDeliveryTimerUpdate,
    orderRouteDistanceUpdate,
    orderRouteTimeUpdate,
    getSelectCourierModeStatus,
    getSelectCourierModeOrderId,
    orderToCourier, loadOrdersList,
    getOrderLoadPage,
    isShowMore,
    getStatuces,
    reLoadOrder,
    saveNotifToHistory,
    getLog
} from '../../../store/orders';
import {
    getCouriers,
    getCouriersLoadingStatus,
    showCourierRoutes,
    reLoadCourier,
    setCourierActive,
    getActiveCourier,
    updateMapRoute,
    getMapRoutes,
    courierDeliveryDistanceUpdate,
    courierDeliveryTimeUpdate
} from '../../../store/couriers';
import OrdersList from '../../ui/orders/OrdersList';
import OrdersListSkeleton from '../../ui/orders/OrdersList/OrdersListSkeleton';
import CouriersList from '../../ui/couriers/CouriersList';
import CouriersListSkeleton from '../../ui/couriers/CouriersList/CouriersListSkeleton';
//import Ymap from '../../common/Ymap'; 
import MapComponent from '../../common/MapComponent';

import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '../../common/Button/Button';
//import ShowOrderNotification from "../../../utils/react-push-notification";
//ShowOrderNotification({title: 'Привет', message: 'У вас 3 новых заказа', subTitle: ''} );

const pageSize = 999;

declare const window: any;



const Home = () => {
    //const isLoggedIn = useSelector(getIsLoggedIn());
    const orders = useSelector(getOrders());
    // const ordersProcessing = useSelector(getOrders('processing'));
    // const ordersDone = useSelector(getOrders('done'));
    // const ordersCompleted = useSelector(getOrders('completed'));
    // const ordersCancelled = useSelector(getOrders('cancelled'));
    const logs = useSelector(getLog());

    const ordersAll = useSelector(getOrders(''));
    //const couriers = useSelector(getCouriers());
   // const mapRoutes = useSelector(getMapRoutes());
   // const activeCourier = useSelector(getActiveCourier());
    const activeCourier =  0;
    const activeOrder = useSelector(getActiveOrder());
    const more_page_number = useSelector(getOrderLoadPage());
    const is_show_more = useSelector(isShowMore());
    const orderStatus = useSelector(getStatuces());

    const dispatch = useAppDispatch();

    const ordersIsLoading = useSelector(getOrdersLoadingStatus());
    const ordersIsLoadingMore = useSelector(getOrdersLoadingMoreStatus());
   // const couriersIsLoading = useSelector(getCouriersLoadingStatus());
    const scm_mode = useSelector(getSelectCourierModeStatus());
    const scm_order_id = useSelector(getSelectCourierModeOrderId());

    const [courier_action_mode, setCourier_mode] = React.useState({courier_action_mode: '', action_courier_id: 0});

    //const scmUpdate = dispatch(getSelectCourierModeOrderId());


    // console.warn('ordersListCrop2222', orders);

//Обратный отсчет времени заказа
//     React.useEffect(() => {
//             window.setInterval(() => {
//                 dispatch(orderDeliveryTimerUpdate());
//             }, 14000)
//         },
//         []
//     )

    type LoadMoreHandler = () => (e: React.MouseEvent) => void; //React.MouseEventHandler<HTMLLIElement>
    type ClickHandler = ($order_id: number) => (e: React.MouseEvent) => void;
    type ClickTargerOrder = ($status: boolean, $order_id: number) => void;
    type ClickTargerCourier = ($courier_id: number, $status: boolean) => void;
    type updateRouteType = (index: number, courier_id: number, status: boolean, route: any, points: any[], orders_points: any[]) => void;
    type updateRouteTimeType = (id: number, delivery_time: string) => void;
    type updateRouteDistanceType = (id: number, distance: string) => void;

    //Клик по кнопке назначить курьера
    const scm_update = (status: boolean, $order_id: number) => {
        if (status)
            dispatch(enableModeSelectCourier({status: status, order_id: $order_id}));
        else
            dispatch(disableModeSelectCourier({status: status, order_id: $order_id}));
    }

    const targerActiveOrder: ClickTargerOrder = ($status, $order_id) => {
        dispatch(seOrderActive($status ? $order_id : null));
    }
    const targerCourier: ClickTargerCourier = ($courier_id, $status) => {
        dispatch(setCourierActive($courier_id === activeCourier ? null : $courier_id));
        dispatch(showCourierRoutes({courier_id: $courier_id, status: $status}));
    }

    const updateRoute: updateRouteType = (index, courier_id, status, route, points, orders_points) => {
        dispatch(updateMapRoute({index: index, data: {courier_id, status, route, points, orders_points}}));
    }
    const updateOrderRouteTime: updateRouteTimeType = (order_id, delivery_time) => {
        dispatch(orderRouteTimeUpdate({order_id, delivery_time}));
    }
    const updateOrderRouteDistance: updateRouteDistanceType = (order_id, delivery_distance) => {
        dispatch(orderRouteDistanceUpdate({order_id, delivery_distance}));
    }

    const updatCourierRouteTime: updateRouteTimeType = (courier_id, delivery_time) => {
        dispatch(courierDeliveryTimeUpdate({courier_id, delivery_time}));
    }
    const updateCourierRouteDistance: updateRouteDistanceType = (courier_id, delivery_distance) => {
        dispatch(courierDeliveryDistanceUpdate({courier_id, delivery_distance}));
    }

    //Назначение курьера
    const setCourierToOrder: ClickHandler = ($courier_id) => (e) => {
        if (scm_mode) {
            //dispatch( courierToOrder({ courier: $courier_id }) );
            const updateOrderPayload = {
                order_id: scm_order_id,
                courier_id: Number($courier_id),
            };
            dispatch(orderToCourier(updateOrderPayload));
            //dispatch(reLoadCourier($courier_id)); //теперь обновляет через сокет
        } else {
            //console.log('scm_mode=false')
            // dispatch( disableModeSelectCourier( {status: status, order_id: $order_id} ) );
        }
    }

    const LoadMoreOrders = (event) => {
        dispatch(loadOrdersList('', more_page_number));
    }
    const selectOrderForAction = ($order_id: number) => {
        setCourier_mode({courier_action_mode: '', action_courier_id: 0});
    }

    //Подгрузка заказов
    // const [scrollTop, setScrollTop] = useState();
    // const [scrolling, setScrolling] = useState();
    //
    // useEffect(() => {
    //     const onScroll = (e) => {
    //         setScrollTop(e.target.documentElement.scrollTop);
    //         //@ts-ignore
    //         setScrolling(e.target.documentElement.scrollTop > scrollTop);
    //     };
    //     window.addEventListener("scroll", onScroll);
    //
    //     return () => window.removeEventListener("scroll", onScroll);
    // }, [scrollTop]);
    //
    // useEffect(() => {
    //     console.log(scrolling);
    // }, [scrolling]);


    // ordersProcessing = useSelector(getOrders('processing'));
    // const ordersDone = useSelector(getOrders('done'));
    // const ordersCompleted = useSelector(getOrders('completed'));
    // const ordersCancelled
    return (
        <div>
        <Container className={`orders-contener`} maxWidth="sm">


                {ordersIsLoading ?
                    <OrdersListSkeleton pageSize={pageSize} />
                    :
                    <OrdersList
                        type="free"
                        status="processing"
                        title="Обработка"
                        orders={orders}
                        ordersStatuces={orderStatus}
                        scm={scm_mode}
                        scm_order_id={scm_order_id}
                        courier_action_mode={courier_action_mode}
                        activeCourier={activeCourier}
                        scmUpdate={scm_update}
                        selectOrderForAction={selectOrderForAction}
                        targerActiveOrder={targerActiveOrder}
                    />}

            <div className={`more-btn-contener-sceleton`}>
                {
                    !ordersIsLoadingMore && !ordersIsLoading
                        ?
                    <OrdersListSkeleton pageSize={pageSize} />
                        :
                    <></>
                }
            </div>
            <div className={`more-btn-contener`}>
                {
                    is_show_more && !ordersIsLoading
                        ?
                    <Button
                        variant="outlined"
                        size="large"
                        onClick={LoadMoreOrders}
                    >
                        Загрузить ещё
                    </Button>
                        :
                    <></>
                }
            </div>

                {/*{(ordersIsLoading) ?*/}
                {/*    <OrdersListSkeleton pageSize={pageSize}/>*/}
                {/*    :*/}
                {/*    <OrdersList*/}
                {/*        type="free"*/}
                {/*        status="done"*/}
                {/*        title="Готов"*/}
                {/*        orders={ordersDone}*/}
                {/*        scm={scm_mode}*/}
                {/*        scm_order_id={scm_order_id}*/}
                {/*        activeCourier={activeCourier}*/}
                {/*        courier_action_mode={courier_action_mode}*/}
                {/*        scmUpdate={scm_update}*/}
                {/*        selectOrderForAction={selectOrderForAction}*/}
                {/*        targerActiveOrder={targerActiveOrder}*/}

                {/*    />*/}
                {/*}*/}

                {/*{(ordersIsLoading) ?*/}
                {/*    <OrdersListSkeleton pageSize={pageSize}/>*/}
                {/*    :*/}
                {/*    <OrdersList*/}
                {/*        type="free"*/}
                {/*        status="canselled"*/}
                {/*        title="Выполнен"*/}
                {/*        orders={ordersCompleted}*/}
                {/*        scm={scm_mode}*/}
                {/*        scm_order_id={scm_order_id}*/}
                {/*        activeCourier={activeCourier}*/}
                {/*        courier_action_mode={courier_action_mode}*/}
                {/*        scmUpdate={scm_update}*/}
                {/*        selectOrderForAction={selectOrderForAction}*/}
                {/*        targerActiveOrder={targerActiveOrder}*/}

                {/*    />*/}
                {/*}*/}
                {/*{(ordersIsLoading) ?*/}
                {/*    <OrdersListSkeleton pageSize={pageSize}/>*/}
                {/*    :*/}
                {/*    <OrdersList*/}
                {/*        type="free"*/}
                {/*        status="canselled"*/}
                {/*        title="Отменён"*/}
                {/*        orders={ordersDone}*/}
                {/*        scm={scm_mode}*/}
                {/*        scm_order_id={scm_order_id}*/}
                {/*        activeCourier={activeCourier}*/}
                {/*        courier_action_mode={courier_action_mode}*/}
                {/*        scmUpdate={scm_update}*/}
                {/*        selectOrderForAction={selectOrderForAction}*/}
                {/*        targerActiveOrder={targerActiveOrder}*/}

                {/*    />*/}
                {/*}*/}

                {/* {roomsIsLoading ? <RoomsListSkeleton pageSize={pageSize} /> : <RoomsList rooms={roomsListCrop} />}   scm_update={scmUpdate} */}

            {/* <div className="map-wrapper">

                ordersIsLoading ? 'загрузка' :
                    <MapComponent

                        activeCourier={activeCourier}
                        activeOrder={activeOrder}
                        orders={ [...ordersProcessing, ...ordersDone] }
                        routes={[]}
                        updateRoute={updateRoute}
                        orderRouteTimeUpdate={updateOrderRouteTime}
                        orderRouteDistanceUpdate={updateOrderRouteDistance}
                        courierDeliveryDistanceUpdate={updateCourierRouteDistance}
                        courierDeliveryTimeUpdate={updatCourierRouteTime}

                        dispatch={dispatch}

                    />

            </div>     */}
            {/*<div*/}
            {/*    className={'logs'}*/}
            {/*>*/}
            {/*    {logs.join('\n')}*/}
            {/*</div>*/}
            </Container>
        </div>
            )
}

export default Home