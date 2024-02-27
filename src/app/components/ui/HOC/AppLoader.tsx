import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    loadOrdersList,
    getOrderLoadPage,
    loadOrdersStatusList,
} from '../../../store/orders';
import {getIsLoggedIn, getUser, getUsersLoadingStatus, loadUserInfo} from '../../../store/users';
import {getClientToken} from "../../../services/firebase.service";


const AppLoader = ({children}: any) => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(getIsLoggedIn());
    const ordersPage = useSelector(getOrderLoadPage());
    const userData = useSelector(getUser())
    //const ordersIsLoading =  useSelector(getOrdersLoadingStatus());
    const usersStatusLoading = useSelector(getUsersLoadingStatus());


    useEffect(() => {
        if (isLoggedIn) {
            dispatch(loadUserInfo());
            dispatch(loadOrdersStatusList());
            dispatch(loadOrdersList('', ordersPage));
            getClientToken();


            // dispatch(loadOrdersList('done'));
            // dispatch(loadOrdersList('completed'));
            // dispatch(loadOrdersList('cancelled'));
            //dispatch(loadCouriersList());

        } else {

        }
        // dispatch(loadLikesList());
        // dispatch(loadReviewsList());
        // dispatch(loadBookingsList());
    }, [isLoggedIn]);

    if (!usersStatusLoading) {

        return children;
    } else {

        return <></>;
    }
};

export default AppLoader;