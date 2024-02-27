import AcUnitIcon from '@mui/icons-material/AcUnit';
import ComputerIcon from '@mui/icons-material/Computer';
import WifiIcon from '@mui/icons-material/Wifi';
import React from 'react';
import {useSelector} from 'react-redux';
// import { Link } from 'react-router-dom';
//import { getReviewsByOrderId } from '../../../../store/reviews';
//import { getReviewsByOrderId } from '../../../../store/orders';
//import declOfNum from '../../../../utils/declOfNum';
//import Badge from '../../../common/Badge';
import {DotsIcon, LocationIcon, TimeIcon, PriceIcon, DownArrowIcon} from '../../../../components/common/Icon/Icon'
//import ImageSlider from '../../../common/ImageSlider';
//import Rating from '../../../common/Rating';
import {CourierType, OrderType} from '../../../../types/types';
import {ListItemText, Button, ListItemButton, List, Collapse} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import getDistanceByCoord from '../../../../utils/mapUtils';
import CourierCard from "../../couriers/CourierCard";

// import ListSubheader from '@mui/material/ListSubheader';

type OrderListProps = {
    free: boolean,
    order: OrderType,
    scm: boolean,
    scm_order_id: number,
    scmUpdate: (status: boolean, order_id: number) => void,
    //activeCourierData: CourierType | null,
    targerActiveOrder: (status: boolean, order_id: number) => void;
    location: number;
    setLocation: (location: number) => void;

};

const comfortIconsMap: { [x: string]: JSX.Element } = {
    hasWifi: <WifiIcon/>,
    hasConditioner: <AcUnitIcon/>,
    hasWorkSpace: <ComputerIcon/>,
};


const OrderCard: React.FC<OrderListProps> = ({
                                                 order,
                                                 scm,
                                                 scm_order_id,
                                                 scmUpdate,
                                                 //activeCourierData,
                                                 targerActiveOrder,
                                                 location,
                                                 setLocation,


                                             }) => {
    // const reviews = useSelector(getReviewsByOrderId(_id));
    // const countReviews = reviews ? reviews.length : 0;
    // const rating = countReviews > 0 ? reviews.reduce((acc, cur) => acc + cur.rating, 0) : 0;

    const setCourierModeUpdate = (status: boolean, order_id: number) => (event: React.MouseEvent<unknown>) => {
        scmUpdate(status, order_id)
    };

    const orderSetActiveHandle = (order_id: number) => (event: React.MouseEvent<unknown>) => {
        setLocation(location == order_id ? 0 : order_id);
        targerActiveOrder(!(location == order_id), order_id);
    };

    const [open, setOpen] = React.useState(true);
    const [openC, setOpenC] = React.useState(true);

    const handleClick = () => {
        setOpen(!open);
    };
    const handleClickC = () => {
        setOpenC(!openC);
    };
    // const setState_addCourier = () => {
    //   useSelector(getReviewsByOrderId(_id));
    // };
    const disableState_addCourier = () => {

    };
    console.warn('___order', order)

    const courier_button = (scm && order.id === scm_order_id) ?
        <Button className='adding-courier-button' onClick={setCourierModeUpdate(false, order.id)}> Выберите
            курьера <DownArrowIcon className='rotate90right'></DownArrowIcon></Button> :
        <Button className='add-courier-button' onClick={setCourierModeUpdate(true, order.id)}> Назначить
            курьера </Button>

    return (
        <div className='order-card'>

            <div className='order-card__top'>
                <div className="order-card__order-number">№{order.number}</div>
                <div className="order-card__context-menu">
                    <DotsIcon></DotsIcon>
                </div>
            </div>
            <div className='order-card__body'>
                <div className='order-card__body-top'>
                    <ul className="order-card__info-list">
                        <li className={order.deliveryTimer < 0 ? "" : "timer_out"}><TimeIcon
                            color={'gay'}></TimeIcon>{order.deliveryTimerPretty}</li>
                        <li
                            className={'order-card__location '+ (location === order.id ? "active " : "") }
                            onClick={orderSetActiveHandle(order.id)}
                        ><LocationIcon></LocationIcon>
                            {/*{*/}
                            {/*    //@ts-ignoredd*/}
                            {/*    activeCourierData && getDistanceByCoord(activeCourierData.coordinates[0], activeCourierData.coordinates[1], order.coordinates_to[0], order.coordinates_to[1])*/}
                            {/*}*/}
                        </li>
                        <li><PriceIcon></PriceIcon>{order.delivery_price}₽</li>
                    </ul>
                </div>
                <div className='order-card__body-middle-inner'>
                    <div className='order-card__body-middle'>
                        {/*<div className="order-card__body-middle__address ">*/}
                        {/*    {order.address_from} <span>откуда</span>*/}
                        {/*</div>*/}
                        {/*<hr></hr>*/}
                        {
                            order.is_pickup
                                ?
                                <div className="order-card__body-middle__address">Самовывоз</div>
                                :
                                <div className="order-card__body-middle__address">{order.address_to.streetAddress}  <span>куда</span> </div>
                        }
                        {
                            order.is_pickup
                                ?
                                ''
                                :
                                <ul className="">
                                    <li><span>Подъезд:</span>
                                        <div>{order.address_to.entrance}</div>
                                    </li>
                                    <li><span>Этаж:</span>
                                        <div>{order.address_to.floor}</div>
                                    </li>
                                    <li><span>Кв:</span>
                                        <div>{order.address_to.flat}</div>
                                    </li>
                                </ul>
                        }

                        {
                            order.payment_type ?
                                <div className="order-card__body-middle__address">
                                    {order.payment_type} <span>оплата</span>
                                </div>
                                :
                                ''
                        }
                        <div className="order-card__body-middle__client-name">{order.client.name} {order.client.phone}</div>

                        <div className="order-card__body-middle__client-name">{order.billing_gatetimecheckout} </div>

                        <div className="order-card__body-middle__address-data">

                            <div className="order-card__body-middle__products">
                                <List
                                    sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                >
                                    <ListItemButton onClick={handleClick}>
                                        <ListItemText classes={{primary: "list-header"}}>
                                            <div>{order.line_items.length} товар(а)</div>
                                            <div>{order.total}₽</div>
                                        </ListItemText>
                                        {open ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItemButton>

                                    <Collapse in={!open} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {
                                                order.line_items.map(product => (
                                                    <ListItemButton key={product.id} sx={{pl: 4}}>
                                                        <div className='product-name'>{product.name}</div>
                                                        <div className='product-quantity'>{product.quantity} шт</div>
                                                    </ListItemButton>
                                                ))}

                                        </List>
                                    </Collapse>

                                </List>


                                {
                                    order.coupon_lines
                                        ?
                                            <List
                                                sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
                                                component="nav"
                                                aria-labelledby="nested-list-subheader"
                                            >
                                                <ListItemButton onClick={handleClickC}>
                                                    <ListItemText classes={{primary: "list-header"}}>
                                                        <div>{order.coupon_lines.length} купон(а)</div>
                                                    </ListItemText>
                                                    {openC ? <ExpandLess/> : <ExpandMore/>}
                                                </ListItemButton>

                                                <Collapse in={!openC} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {
                                                            order.coupon_lines.map(coupon => (
                                                                <ListItemButton key={coupon.id} sx={{pl: 4}}>
                                                                    <div className='product-name'>{coupon.code}</div>
                                                                    <div className='product-quantity'>{coupon.discount} шт</div>
                                                                </ListItemButton>
                                                            ))}

                                                    </List>
                                                </Collapse>

                                            </List>
                                        : ''
                                }
                            </div>
                        </div>
                        <div className='order-card__body-bottom'>
                        </div>
                    </div>
                </div>
            </div>
            <div className='order-card__bottom'>
                {/* тут будет назначенный курьер */}

                <div>
                    {/* <button className='add-courier-button' onClick={setState_addCourier}>Назначить курьера</button> */}
                    {/*{courier_button}*/}
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
