import React from 'react';
import {OrderType, OrderStatusType} from '../../../../types/types';
import OrderCardAccordion from "../OrderCardAccordion";
import Stack from '@mui/material/Stack';

type OrderListProps = {
    type: string,
    status: string,
    title: string,
    orders: OrderType[],
    ordersStatuces: OrderStatusType[],
    scm: boolean,
    scm_order_id: number,
    activeCourier: number,
    courier_action_mode: { courier_action_mode: string, action_courier_id: number },
    scmUpdate: (status: boolean, order_id: number) => void;//React.MouseEvent<HTMLElement>,
    selectOrderForAction: (order_id: number) => void;
    targerActiveOrder: (status: boolean, order_id: number) => void;

};

const OrdersList: React.FC<OrderListProps> = ({
                                                  type,
                                                  status,
                                                  title,
                                                  orders,
                                                  ordersStatuces,
                                                  scm,
                                                  scm_order_id,
                                                  courier_action_mode,
                                                  activeCourier,
                                                  scmUpdate,
                                                  selectOrderForAction,
                                                  targerActiveOrder,
                                              }) => {

    const free = (type === 'free') ? true : false;
    const [location, setLocation] = React.useState(0);


    const [ordersFilter, setCouriersFilter] = React.useState(3);
    const ordersFilterHandle = (new_filter: number) => (event: React.MouseEvent<unknown>) => {
        setCouriersFilter(new_filter);
    };

    const filter_orders = (orders, ordersFilter, free) => orders.filter(order => {
        if (free)
            return (order.status === 1);

        // if( ordersFilter === 3 )
        //   return ( order.status === 3 || order.status === 2 )

        return (order.status === ordersFilter)
    });

    const clickOrderHandle = (order_id: number) => (event: React.MouseEvent<unknown>) => {
        selectOrderForAction(order_id);
    };
    const contenerClass = 'orders__list' + (activeCourier && !free ? ' courier_active_mode' : '');
    const activeCourierData = {};

    return (
        <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={1}
        >
            {
                orders.map(order => {

                    return (
                        <OrderCardAccordion
                            key={order.id}
                            order={order}
                            ordersStatus={ordersStatuces}
                            scm={scm}
                            scm_order_id={scm_order_id}
                            scmUpdate={scmUpdate}
                            // activeCourierData={activeCourierData}
                            targerActiveOrder={targerActiveOrder}
                            location={location}
                            setLocation={setLocation}
                        />
                    )
                })
            }
        </Stack>
    );
};

export default React.memo(OrdersList);
