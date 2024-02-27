import AcUnitIcon from '@mui/icons-material/AcUnit';
import ComputerIcon from '@mui/icons-material/Computer';
import WifiIcon from '@mui/icons-material/Wifi';
import React from 'react';
import {OrderType, OrderStatusType} from '../../../../types/types';
import {DotsIcon, LocationIcon, TimeIcon, PriceIcon, DownArrowIcon} from '../../../../components/common/Icon/Icon'
import {ListItemText, Button, ListItemButton, List, Collapse, Paper, Link} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import {getOrderStatusColor} from '../../../../utils/ordersUtils';
import {ConfirmationDialog} from '../../../ui/modals/OrderStatusDialog/orderStatusDialog.js'

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import {upgateOrderStatus,} from "../../../../store/orders";
import {useAppDispatch} from '../../../../store/createStore';
import Divider from "@mui/material/Divider";
import formatDate from '../../../../utils/formatDate'
import Container from "@mui/material/Container";

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import {TotalLine} from "../OrderItemTotalLine/orderItemTotalLine";
// import ListSubheader from '@mui/material/ListSubheader';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import EmailIcon from '@mui/icons-material/Email';

type OrderListProps = {
    order: OrderType,
    ordersStatus: Array<OrderStatusType>,
    scm: boolean,
    scm_order_id: number,
    scmUpdate: (status: boolean, order_id: number) => void,
    targerActiveOrder: (status: boolean, order_id: number) => void;
    location: number;
    setLocation: (location: number) => void;

};

const comfortIconsMap: { [x: string]: JSX.Element } = {
    hasWifi: <WifiIcon/>,
    hasConditioner: <AcUnitIcon/>,
    hasWorkSpace: <ComputerIcon/>,
};


const OrderCardAccordion: React.FC<OrderListProps> = ({
                                                          order,
                                                          ordersStatus,
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
    const orderSetActiveHandle = (order_id: number) => (event: React.MouseEvent<unknown>) => {
        setLocation(location == order_id ? 0 : order_id);
        targerActiveOrder(!(location == order_id), order_id);
    };

    const dispatch = useAppDispatch();

    const [open, setOpen] = React.useState(true);
    const [openC, setOpenC] = React.useState(true);
    const [openD, setOpenD] = React.useState(true);
    const handleClick = () => {
        setOpen(!open);
    };
    const handleClickC = () => {
        setOpenC(!openC);
    };
    const handleClickD = () => {
        setOpenD(!openD);
    };

    const statusColor = getOrderStatusColor(order.status);
    const orderStatusColorObj = (order.status === 'completed')
        ?
        {
            backgroundColor: statusColor,
        }
        :
        {}
    const prepareStatus = (status) => {
        const ordersStatusSearch = ordersStatus.find(s => s.code === status)

        return (
            <Box
                className={'order-status-box'}
                sx={{
                    width: 'auto',
                    height: 25,
                    minWidth: 75,
                    padding: '3px 5px',
                    color: 'white',
                    backgroundColor: statusColor,
                    '&:hover': {
                        backgroundColor: statusColor,
                        opacity: [0.9, 0.8, 0.7],
                    },
                }}
            >
                {!!ordersStatusSearch ? ordersStatusSearch.name : status}
            </Box>
        )
    }
    const [expanded, setExpanded] = React.useState('');
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : '');
    };
    const handleDialogClose = () => {
        setStatusDialogHandle(false)
    };
    const handleDialogOpen = () => (event) => {
        event.stopPropagation();
        setStatusDialogHandle(true)
    }
    const ChangeStatus = (status) => {
        //vent.stopPropagation();
        //alert('NEW ChangeStatus ' + status);
        // setStatusDialogHandle(true);

        // dispatch(loadOrdersList('', more_page_number));

        // return false;
        dispatch(upgateOrderStatus({status: status, order_id: order.id}));
    }

    const [statusDialogHandle, setStatusDialogHandle] = React.useState(false);

    return (
        <Accordion className={`order-accordion-element`} expanded={expanded === `panel_${order.id}`}
                   onChange={handleChange(`panel_${order.id}`)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={orderStatusColorObj}
            >
                <div className={`order-accordion-header`}>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={0.5}
                    >
                        <Container disableGutters sx={{padding: 0}}>
                            <Typography sx={{color: 'text.secondary'}}>№{order.id}</Typography>
                            <Typography sx={{
                                color: 'text.disabled',
                                fontSize: 14
                            }}>{formatDate(order.date_created)}</Typography>
                        </Container>
                        <Typography sx={{color: 'text.secondary'}}>
                            {order.client.name}
                        </Typography>
                    </Stack>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={0.5}
                    >
                        <div
                            onClick={handleDialogOpen()}
                        >
                            {prepareStatus(order.status)}
                        </div>
                        <Typography sx={{color: 'text.secondary'}}>{order.total}₽</Typography>
                    </Stack>
                </div>
            </AccordionSummary>
            <AccordionDetails>

                <div className='order-card__body-middle'>
                    {/*//Клиент//*/}
                    <Card sx={{minWidth: 275}}>
                        <CardContent>
                            <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                покупатель
                            </Typography>
                            <Typography variant="h5" component="div">
                                {order.client.name}
                            </Typography>
                            <Typography sx={{mb: 1.5}} color="text.secondary">
                                +{order.client.phone}
                            </Typography>
                            {
                                order.client.email.includes("maill") === false
                                    ?
                                    (
                                        <Typography sx={{mb: 1.5}} color="text.secondary">
                                            {order.client.email}
                                        </Typography>
                                    )
                                    :
                                    <></>
                            }
                            {/*<Typography variant="body2">*/}
                            {/*    well meaning and kindly.*/}
                            {/*    <br />*/}
                            {/*    {'"a benevolent smile"'}*/}
                            {/*</Typography>*/}
                        </CardContent>
                        <CardActions>
                            <Button size="medium" variant="outlined"
                                    href={`tel:+` + order.client.phone}>
                                <PhoneInTalkIcon/>
                            </Button>
                            <Button size="medium" variant="outlined"
                                    href={`mailto:+` + order.client.email}>
                                <EmailIcon/>
                            </Button>
                            <Button size="medium" variant="outlined"
                                    target={'_blank'}
                                    href={`https://wa.me/${order.client.phone}`}>
                                <WhatsAppIcon/>
                            </Button>
                            <Button size="medium" variant="outlined"
                                    target={'_blank'}
                                    href={`https://t.me/+${order.client.phone}`}>
                                <TelegramIcon/>
                            </Button>
                        </CardActions>
                    </Card>
                    {/*//Адрес//*/}

                    <Paper>
                        <Card sx={{minWidth: 275}} elevation={0}>
                            <CardContent>
                                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                    {order.delivery_name}
                                </Typography>
                                <Typography sx={{ whiteSpace: `pre-wrap` }} variant="h6" component="div">
                                    {order.address_string}
                                </Typography>
                                <Typography sx={{mb: 1.5}} color="text.secondary">
                                    {order.billing_gatetimecheckout}
                                </Typography>

                                <Divider/>
                                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                    оплата
                                </Typography>
                                <Typography variant="h6" component="div">
                                    {order.payment_method_title}
                                </Typography>
                                {/*<Typography variant="body2">*/}
                                {/*    well meaning and kindly.*/}
                                {/*    <br />*/}
                                {/*    {'"a benevolent smile"'}*/}
                                {/*</Typography>*/}
                            </CardContent>
                            <CardActions>

                            </CardActions>
                        </Card>
                    </Paper>

                    <div className="order-card__body-middle__address-data">
                        <div className="order-card__body-middle__products">
                            <Card sx={{minWidth: 275}}>
                                <CardContent>
                                    <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                        состав
                                    </Typography>

                                    {/*//Товары//*/}
                                    <List
                                        sx={{width: '100%', bgcolor: 'background.paper'}}
                                        component="nav"
                                        aria-labelledby="nested-list-subheader"
                                    >
                                        <ListItemButton onClick={handleClick}>
                                            <ListItemText classes={{primary: "list-header"}}>
                                                <Stack
                                                    direction="row"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                    spacing={2}
                                                    sx={{width: '90%'}}
                                                >
                                                    <div>{order.line_items.length} товар(а)</div>
                                                    <div>{order.total}₽</div>
                                                </Stack>
                                            </ListItemText>
                                            {open ? <ExpandLess/> : <ExpandMore/>}
                                        </ListItemButton>

                                        <Collapse in={!open} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding>
                                                {
                                                    order.line_items.map(product => (
                                                        <ListItemButton key={order.id + '_' + product.id}
                                                                        sx={{width: '100%', pl: 4}}>
                                                            <div className={'order-products-list-contener'}>
                                                                <div className='image-contener'>
                                                                    <img
                                                                        // src={product.image.src.replace(/\.(\w+\w+\w+)$/gm, '-small.$1')}
                                                                        src={product.image ? product.image.src : '/img/noimage.jpg'}
                                                                    />
                                                                </div>
                                                                <div
                                                                    className='product-name'>{product.name} {(product.sku ? `(${product.sku})` : ``)}</div>
                                                                <div
                                                                    className='product-quantity'>{product.quantity} шт
                                                                </div>
                                                                <div className='product-quantity'>
                                                                    {product.price} {process.env.REACT_APP_API_CURRENCY ? process.env.REACT_APP_API_CURRENCY : '₽'}
                                                                </div>
                                                                {
                                                                    product.cost_price ?
                                                                        <div className='product-quantity-cost_price'>{product.cost_price} {process.env.REACT_APP_API_CURRENCY ? process.env.REACT_APP_API_CURRENCY : '₽'}</div>
                                                                    :
                                                                        <div className='product-quantity-cost_price'></div>
                                                                }
                                                            </div>
                                                        </ListItemButton>
                                                    ))
                                                }
                                            </List>
                                        </Collapse>

                                    </List>

                                    <Divider/>
                                    {/*//Купоны//*/}
                                    {
                                        order.coupon_lines.length > 0
                                            ?
                                            <List
                                                sx={{width: '100%', bgcolor: 'background.paper'}}
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
                                                                <ListItemButton key={order.id + '_' + coupon.id}
                                                                                sx={{pl: 4}}>
                                                                    <div className={'order-products-list-contener'}>
                                                                        <div
                                                                            className='product-name'>{coupon.code}</div>
                                                                        <div
                                                                            className='product-quantity'>{coupon.discount}₽
                                                                        </div>
                                                                    </div>
                                                                </ListItemButton>
                                                            ))}

                                                    </List>
                                                </Collapse>

                                            </List>
                                            : ''
                                    }
                                    <Divider/>

                                    {/*//Доставка//*/}
                                    {
                                        order.shipping_lines.length > 0
                                            ?
                                            <List
                                                sx={{width: '100%', bgcolor: 'background.paper'}}
                                                component="nav"
                                                aria-labelledby="nested-list-subheader"
                                            >
                                                <ListItemButton onClick={handleClickD}>
                                                    <ListItemText classes={{primary: "list-header"}}>
                                                        <div>Доставка</div>
                                                    </ListItemText>
                                                    {openD ? <ExpandLess/> : <ExpandMore/>}
                                                </ListItemButton>

                                                <Collapse in={!openD} timeout="auto" unmountOnExit>
                                                    <List component="div" disablePadding>
                                                        {
                                                            order.shipping_lines.map(coupon => (
                                                                <ListItemButton key={order.id + '_' + coupon.id}
                                                                                sx={{pl: 4}}>
                                                                    <div className={'order-products-list-contener'}>
                                                                        <div
                                                                            className='product-name'>{coupon.method_title}</div>
                                                                        <div
                                                                            className='product-quantity'>{coupon.total}₽
                                                                        </div>
                                                                    </div>
                                                                </ListItemButton>
                                                            ))}

                                                    </List>
                                                </Collapse>

                                            </List>
                                            : ''
                                    }

                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/*//Итого заказа//*/}
                    <Paper>
                        <Card sx={{minWidth: 275}} elevation={0}>
                            <CardContent>
                                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                    итого
                                </Typography>
                                {/*<Typography variant="h6" component="div">*/}
                                {/*    {order.address_string}*/}
                                {/*</Typography>*/}
                                {/*<Typography sx={{mb: 1.5}} color="text.secondary">*/}
                                {/*    {order.billing_gatetimecheckout}*/}
                                {/*</Typography>*/}

                                <TotalLine total={order.productsTotal} title="Подытог по товарам:"/>
                                <TotalLine total={order.couponsTotal} title="Купоны:"/>
                                <TotalLine total={order.shippingTotal} title="Доставка:"/>


                                {
                                    order.feeTotal
                                        ?
                                        <TotalLine total={order.feeTotal} title="Скидка за допы:"/>
                                        :
                                        ''
                                }
                                <TotalLine total={order.total} title="Итог заказа:"/>
                                <Divider
                                    sx={{
                                        margin: '5px 0',
                                    }}
                                />
                                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                    оплата
                                </Typography>
                                <Typography variant="h6" component="div">
                                    {order.payment_method_title}
                                </Typography>
                                {
                                    order.customer_note ?
                                        (
                                            <>
                                                <Divider
                                                    sx={{
                                                        margin: '5px 0',
                                                    }}
                                                />
                                                <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                                                    коментарий покупателя:
                                                </Typography>
                                                <Typography component="div">
                                                    {order.customer_note}
                                                </Typography>
                                            </>
                                        )
                                        :
                                        <></>
                                }
                                {/*<Typography variant="body2">*/}
                                {/*    well meaning and kindly.*/}
                                {/*    <br />*/}
                                {/*    {'"a benevolent smile"'}*/}
                                {/*</Typography>*/}
                            </CardContent>
                            <CardActions>

                            </CardActions>
                        </Card>
                    </Paper>

                    <div className='order-card__body-bottom'>
                    </div>
                </div>

                <div className={`order-card-body-bottom`}>

                </div>
            </AccordionDetails>
            <ConfirmationDialog
                openDialog={statusDialogHandle}
                orderStatus={order.status}
                handleDialogClose={handleDialogClose}
                newStatusSet={ChangeStatus}
            />
        </Accordion>

    );
};

export default OrderCardAccordion
