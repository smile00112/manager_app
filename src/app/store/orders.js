//import { AppThunk, RootState } from './createStore';
//import { OrderType, BookingType } from './../types/types';
import {createAction, createSlice} from '@reduxjs/toolkit';
import ordersService from '../services/orders.service';
import {dateDiff, timeDiff} from '../utils/getDateDiff';
import {findMeta, prepareOrderItemData} from '../utils/ordersUtils';
import configFile from '../config.json';
import couriersService from "../services/couriers.service";
import {useSelector} from "react-redux";

const DEBUG = false;
const ordersSlice = createSlice({
    name: 'orders',
    initialState: {
        entities: [],
        entitiesFiltered: [],
        orderStatus: [],
        entitiesProcessing: [],
        entitiesDone: [],
        entitiesCompleted: [],
        entitiesCancelled: [],
        app_logs: ['Logs'],

        filteredEntities: [],
        isLoading: true,
        isLoadingMore: true,
        isLoadingStatuces: true,


        isLoadingProcessing: true,
        isLoadingDone: true,
        isLoadingCanselled: true,
        isLoadingCompleted: true,


        selectCourierMode: false,
        selectCourierForOrder: 0,
        activeOrder: null,
        error: null,
        page: 1,
        showMoreBtnDisable: false,
        search: '',
        filters: {},
        filter_is_active: false,

        notificationHistory: []
    },
    reducers: {
        ordersRequested: state => {
            state.isLoading = true;
        },
        ordersMoreRequested: state => {
            state.isLoadingMore = true;
        },
        ordersStatucesRequested: state => {
            state.isLoadingStatuces = true;
        },
        ordersReceived: (state, action) => {

            action.payload.data.content.map(
                order => {
                    return prepareOrderItemData(order);
                }
            );
            if (DEBUG) console.log('___ordersReceived', action.payload.data.content);
            // switch (action.payload.status) {
            //     case 'processing':
            //         state.entitiesProcessing = action.payload.data.content;
            //         state.isLoadingProcessing = false
            //         break;
            //     case 'done':
            //         state.entitiesDone = action.payload.data.content;
            //         state.isLoadingDone = false
            //
            //         break;
            //     case 'completed':
            //         state.entitiesCompleted = action.payload.data.content;
            //         state.isLoadingCompleted = false
            //
            //         break;
            //     case 'cancelled':
            //         state.entitiesCancelled = action.payload.data.content;
            //         state.isLoadingCanselled = false
            //
            //         break;
            //
            //     default:
            //
            //         break;
            // }
            //сортируем по активным заказам

            // state.isLoading = state.isLoadingProcessing || state.isLoadingDone || state.isLoadingCanselled || state.isLoadingCompleted;
            //
            // if(state.isLoading === false){
            //     state.entities = [ ...state.entitiesProcessing, ...state.entitiesDone, ...state.entitiesCompleted, ...state.entitiesCancelled]
            //     state.entities.sort( (a, b) => b.id - a.id );
            // }
            if (action.payload.data.content.length != configFile.orders_perpage)
                state.showMoreBtnDisable = true;

            if (DEBUG) console.log(action.payload.data.content);

            state.entities = state.entities.length ? state.entities.concat(action.payload.data.content) : action.payload.data.content;
            state.isLoading = false;
            state.isLoadingMore = false;

            state.page++;
        },
        ordersStatusReceived: (state, action) => {
            //  alert()
            if (DEBUG) console.log('___ordersStatucesReceived', action.payload);

            const allStatus = Object.assign({}, action.payload.data.content.delivery, action.payload.data.content.pickup);
            const allStatusKeys = Object.entries(allStatus).map(([code, name]) => ({code, name}));

            //
            // let statusAll = {};console.log(action.payload.data.content)
            // action.payload.data.content.delivery.map(
            //     deliv => {
            //         console.log(deliv)
            //
            //         }
            // );
            //
            if (DEBUG) console.log('___ordersStatucesReceived 22', allStatusKeys);

            state.orderStatus = allStatusKeys;
            state.isLoadingStatuces = false;
        },
        filteredOrdersReceived: (state, action) => {
            state.filteredEntities = action.payload;
            state.isLoading = false;
        },
        ordersRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        orderUpdated: (state, action) => {
            if(DEBUG) console.log('orderUpdated', action)
            const orderIndex = state.entities.findIndex(order => order.id === action.payload.id);
            if (orderIndex !== -1) { //update
                //state.entities[orderIndex] = action.payload;
                state.entities[orderIndex].status = action.payload.status;
            } else { //add
                console.warn('add ORDER ', action.payload)
                state.entities.unshift(prepareOrderItemData(action.payload));
            }
            //сортируем по активным заказам
            //state.entities = state.entities.sort((a, b) => ((a.current_order === b.current_order) ? 0 : (a.current_order ? -1 : 1)));

        },
        updateOrderStatus: (state, action) => {
            if (DEBUG) console.log('updateOrderStatus', action)
            const orderIndex = state.entities.findIndex(order => order.id === action.payload.id);
            if (orderIndex !== -1) { //update
                state.entities[orderIndex].status = action.payload.status;

            } else { //add

                // state.entities.unshift(prepareOrderItemData(action.payload.data));
            }

        },
        orderNew: (state, action) => {
            console.log('orderNew store', action.payload)
            if(action.payload)
                state.entities.unshift(prepareOrderItemData( action.payload ));
        },
        orderSelectCourierModeEnable: (state, action) => {
            console.log('reducer_orderSelectCourierModeEnable', action);
            state.selectCourierMode = true;
            state.selectCourierForOrder = action.payload.order_id;
        },
        orderSelectCourierModeDisable: (state, action) => {
            state.selectCourierMode = false;
            state.selectCourierForOrder = 0;
        },
        orderSetCourierToOrder: (state, action) => {
            if (DEBUG) console.log('state', action, action.payload, 'state', state)
            state.selectCourierMode = false;
            state.selectCourierForOrder = 0;
        },
        orderDeliveryTimerReducer: (state, action) => {
            state.entities.map(
                order => dateDiff(Date.parse(order.order_close_time), new Date())
            );
        },
        orderRouteDistanceReducer: (state, action) => {
            //if(DEBUG) console.warn('=====orderRouteDistanceReducer====', action, state);

            const orderIndex = state.entities.findIndex(order => order.id === action.payload.order_id);
            state.entities[orderIndex].routeDistance = action.payload.delivery_distance;

        },
        orderRouteTimeReducer: (state, action) => {
            //if(DEBUG) console.warn('=====orderRouteDistanceReducer====', action, state);

            const orderIndex = state.entities.findIndex(order => order.id === action.payload.order_id);
            state.entities[orderIndex].routeTime = action.payload.delivery_time;
            // state.entities.map(
            //     order => 'Route time 4567'
            // );
        },
        updateCourierCurrentOrder: (state, action) => {
            // state.entities.map(
            //   order => dateDiff(Date.parse(order.order_close_time), new Date())
            // );
        },
        setActiveOrder: (state, action) => {
            state.activeOrder = action.payload;
        },
        setPageReducer: (state, action) => {
            state.page = action.payload;
        },
        setSearch: (state, action) => {
            state.search = action.payload;
            state.entitiesFiltered = state.entities.filter(order => {
                if (String(order.id).indexOf(state.search) >= 0) return true;
                if (String(order.payment_method_title).indexOf(state.search) >= 0) return true;
                if (String(order.address_to.streetName).indexOf(state.search) >= 0) return true;
                if (String(order.client.name).indexOf(state.search) >= 0) return true;
                if (String(order.client.phone).indexOf(state.search) >= 0) return true;
                if (String(order.delivery_name).indexOf(state.search) >= 0) return true;


                return false;
            });
        },
        setFilters: (state, action) => {
            state.filters = Object.assign({}, state.filters, action.payload);

            state.filter_is_active =
                state.filters.status ||
                state.filters.delivery_code ||
                state.filters.price_from ||
                state.filters.price_to ||
                state.filters.date_from ||
                state.filters.date_to

            if (state.filter_is_active)
                state.entitiesFiltered = state.entities.filter(order => {
                    let is_filter = false;
                    if (!!state.filters.status && state.filters.status !== '') {
                        if (order.status == state.filters.status) is_filter = true;
                        else return false;
                    }

                    if (!!state.filters.delivery_code && state.filters.delivery_code !== '') {
                        if (order.delivery_code == state.filters.delivery_code) is_filter = true;
                        else return false;
                    }

                    if (!!state.filters.price_from && state.filters.price_from !== 0) {
                        if (order.total >= state.filters.price_from) is_filter = true;
                        else return false;
                    }
                    if (!!state.filters.price_to && state.filters.price_to !== 0) {
                        if (order.total <= state.filters.price_to) is_filter = true;
                        else return false;
                    }

                    if (!!state.filters.date_from && state.filters.date_from !== '') {
                        let order_date = new Date(order.date_created);
                        let filter_date = new Date(state.filters.date_from);
                        if (order_date >= filter_date) is_filter = true;
                        else return false;
                    }

                    if (!!state.filters.date_to && state.filters.date_to !== '') {
                        let order_date = new Date(order.date_created);
                        let filter_date = new Date(state.filters.date_to);
                        if (order_date <= filter_date) is_filter = true;
                        else return false;
                    }

                    return is_filter;
                });

        },
        addNotificationHistory: (state, action) => {
            console.log('addNotificationHistory', action.payload)
            state.notificationHistory.push(action.payload);
            console.log('notificationHistory', state.notificationHistory)

        },
        addTolog: (state, action) => {
            // console.log('addTolog', action.payload)
            state.app_logs.push(action.payload);
            // console.log('__LOG__', state.app_logs)

        },
        deleteNotifFromHistory: (state, action) => {
            // console.log('deleteNotifFromHistory', action.payload)

            const index = action.payload
            if (index > -1) { // only splice array when item is found
                state.notificationHistory.splice(index, 1); // 2nd parameter means remove one item only
            }
        },
        clearOrders: (state, action) => {
            // console.log('clearOrders');
            state.entities=[];
            state.entitiesFiltered=[];
        },
    },
});

const {actions, reducer: ordersReducer} = ordersSlice;

const {
    ordersRequested,
    ordersMoreRequested,
    ordersStatucesRequested,
    ordersReceived,
    ordersStatusReceived,
    ordersRequestFailed,
    orderUpdated,
    filteredOrdersReceived,
    orderDeliveryTimerReducer,
    orderRouteDistanceReducer,
    orderRouteTimeReducer,
    setPageReducer,
    orderSelectCourierModeEnable,
    orderSelectCourierModeDisable,
    orderSetCourierToOrder,
    orderNew,
    updateCourierCurrentOrder,
    updateOrderStatus,
    setActiveOrder,
    setSearch,
    setFilters,
    addNotificationHistory,
    deleteNotifFromHistory,
    clearOrders,
    addTolog
} = actions;

const addBookingOrderRequested = createAction('orders/addBookingOrderRequested');
const addBookingOrderRequestedSuccess = createAction('orders/addBookingOrderRequestedSuccess');
const addBookingOrderRequestedFailed = createAction('orders/addBookingOrderRequestedFailed');

const removeBookingOrderRequested = createAction('orders/removeBookingOrderRequested');
const removeBookingOrderRequestedSuccess = createAction('orders/removeBookingOrderRequestedSuccess');
const removeBookingOrderRequestedFailed = createAction('orders/removeBookingOrderRequestedFailed');

const orderUpdateRequested = createAction('orders/orderUpdateRequested');
const orderUpdateRequestedFailed = createAction('orders/orderUpdateRequestedFailed');

export const loadOrdersList = (status = '', page) => async (dispatch) => {
    if (page == 1)
        dispatch(ordersRequested());
    else
        dispatch(ordersMoreRequested());
    try {
        const data = await ordersService.getAll(status, page);
        if (DEBUG) console.log('content 2 ', data);
        dispatch(ordersReceived(data || []));

    } catch (error) {
        dispatch(ordersRequestFailed(error.message));
    }
};
export const clearOrdersList = () => async (dispatch) => {
    dispatch(clearOrders());
};
export const loadOrdersStatusList = (payload) => async (dispatch) => {
    dispatch(ordersStatucesRequested());
    try {
        const data = await ordersService.getStatuces();

        dispatch(ordersStatusReceived(data || []));

        if (DEBUG) console.log('content 3 ', data);

    } catch (error) {
        dispatch(ordersRequestFailed(error.message));
    }
};
export const loadFilteredOrdersList =
    (queryParams) =>
        async dispatch => {
            dispatch(ordersRequested());
            try {
                const {content} = await ordersService.getAll(queryParams);
                //if(DEBUG) console.log('content', content);
                dispatch(filteredOrdersReceived(content.data || []));
            } catch (error) {
                dispatch(ordersRequestFailed(error.message));
            }
        };

export const addBookingOrder =
    (payload) =>
        async dispatch => {
            dispatch(addBookingOrderRequested());
            try {
                ordersService.setBooking(payload);
                dispatch(addBookingOrderRequestedSuccess());
            } catch (error) {
                dispatch(addBookingOrderRequestedFailed());
            }
        };

export const removeBookingOrder =
    (payload) =>
        //(payload: { orderId; id }) =>
        async dispatch => {
            dispatch(removeBookingOrderRequested());
            try {
                ordersService.deleteBooking(payload);
                dispatch(removeBookingOrderRequestedSuccess());
            } catch (error) {
                dispatch(removeBookingOrderRequestedFailed());
            }
        };

export const updateOrderData =
    (payload) =>
        async dispatch => {
            if (DEBUG) console.log('updateOrderData payload', payload)
            dispatch(orderUpdateRequested());
            try {
                const {content} = await ordersService.orderToCourier(payload);
                //dispatch(orderUpdated(content));
                dispatch(orderSelectCourierModeDisable());
            } catch (error) {
                if (DEBUG) console.log(error);
                dispatch(orderUpdateRequestedFailed());
            }
        };

export const orderToCourier =
    (payload) =>
        async dispatch => {
            if (DEBUG) console.log('orderToCourier payload', payload)
            dispatch(orderUpdateRequested());
            try {
                const {content} = await ordersService.orderToCourier(payload);
                //dispatch(orderUpdated(content));
                dispatch(orderSelectCourierModeDisable());
            } catch (error) {
                if (DEBUG) console.log(error);
                dispatch(orderUpdateRequestedFailed());
            }
        };

export const reLoadOrder = (payload) => async dispatch => {
    if (DEBUG) console.warn('reLoadOrder payload', payload)
    try {
        const {content} = await ordersService.getById(payload);
        if (DEBUG) console.warn('reLoadOrder payload 222', content)
        //dispatch(orderNew(content || {}));
       //dispatch(updateOrderStatus(content || {}));
        dispatch(orderUpdated(content || []));

    } catch (error) {
        if (DEBUG) console.error('reLoadCourier error', error);
    }
};

export const upgateOrderStatus = (payload) => async dispatch => {
    if (DEBUG) console.warn('upgateOrderStatus payload', payload)
    try {
        const {content} = await ordersService.changeStatus(payload);
        // dispatch(orderUpdated(content || []));
        dispatch(updateOrderStatus(payload));
    } catch (error) {
        if (DEBUG) console.error('reLoadCourier error', error);
    }
};

export const updateCourierCurrentOrderInOrder = (payload) => async dispatch => {
    if (DEBUG) console.log('updateCourierCurrentOrderInOrder payload STOP', payload);
    dispatch(updateCourierCurrentOrder(payload));
}
export const updateSearch = (payload) => async dispatch => {
    if (DEBUG) console.log('updateSearch payload STOP', payload);
    dispatch(setSearch(payload));
}
export const addLog = (payload) => async dispatch => {
    if (DEBUG) console.log('addLog payload STOP', payload);
    dispatch(addTolog(payload));
}
export const updateFilters = (payload) => async dispatch => {
    if (DEBUG) console.log('updateFilters payload STOP', payload);

    dispatch(setFilters(payload));
}
export const getOrders = (status = '') => (state) => {

    if (!state.orders.search && !state.orders.filter_is_active)
        return state.orders.entities;
    else
        return state.orders.entitiesFiltered;

}
export const saveNotifToHistory = (notif_text) => async dispatch => {
    dispatch(addNotificationHistory(notif_text));
}
export const deleteNotification = (notification_index) => async dispatch => {
    dispatch(deleteNotifFromHistory(notification_index));
}

export const getFilteredOrders = () => (state) => state.orders.filteredEntities;
export const getOrdersLoadingStatus = () => (state) => state.orders.isLoading;
export const getOrdersLoadingMoreStatus = () => (state) => !state.orders.isLoadingMore;
export const getStatucesLoadingStatus = () => (state) => !state.orders.isLoadingStatuces;
export const getStatuces = () => (state) => state.orders.orderStatus;
export const getSelectCourierModeStatus = () => (state) => state.orders.selectCourierMode;
export const getSelectCourierModeOrderId = () => (state) => state.orders.selectCourierForOrder;
export const getOrderById = (orderId) => (state) => {
    if (state.orders.entities) {
        return state.orders.entities.find(order => order.id === orderId);
    }
};


export const sosketNewOrder = (payload) => orderNew(payload);
export const sosketUpdateOrder = (payload) => orderUpdated(payload);
export const orderDeliveryTimerUpdate = () => orderDeliveryTimerReducer();
export const orderRouteDistanceUpdate = (payload) => orderRouteDistanceReducer(payload);
export const orderRouteTimeUpdate = (payload) => orderRouteTimeReducer(payload);
export const enableModeSelectCourier = (payload) => orderSelectCourierModeEnable(payload);
export const disableModeSelectCourier = (payload) => orderSelectCourierModeDisable(payload);
export const courierToOrder = (payload) => orderSetCourierToOrder(payload);

export const getOrderLoadPage = () => (state) => state.orders.page;
export const getLog = () => (state) => !!state.orders.app_logs ? state.orders.app_logs : []
export const isShowMore = () => (state) => !state.orders.showMoreBtnDisable;
export const getSearch = () => (state) => state.orders.search;
export const getFilters = () => (state) => state.orders.filters;
export const getNotificationHistory = () => (state) => state.orders.notificationHistory;
export const getOrdersByIds = (ordersIds) => (state) => {
    if (state.orders.entities) {
        return state.orders.entities.filter(order => (ordersIds.length > 0 ? ordersIds.includes(order.id || '') : false));
    }
    return [];
};

export const seOrderActive = (payload) => async dispatch => {
    if (DEBUG) console.log('setActiveCourier payload ', payload)
    dispatch(setActiveOrder(payload || null));
    //dispatch(couriersSort());
}
export const getActiveOrder = () => (state) => state.orders.activeOrder;

export default ordersReducer;
