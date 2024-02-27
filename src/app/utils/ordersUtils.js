const getCourierRouteObj = (courier, active_courier = false) => {
    let points = [courier.coordinates];
    let orders_points = [];
    if(typeof courier.orders !== 'undefined' && courier.orders.length > 0){
        //courier.orders = courier.orders.sort((a, b) => a.created_at - b.created_at);
        //список координат заказов
        points= [...points, ...courier.orders.map( order => order.coordinates_to )];
        //список заказов с координатами
        orders_points = [...orders_points, ...courier.orders.map( order => ({ coordinates: order.coordinates_to, order: order.id }) ) ]
    }

    //приводим средство передвижения курьера в нужный для маршрута вид
    const transport_routMode = {walker: 'pedestrian', car: 'auto', bicycle: 'bicycle' }
    const transport = !!transport_routMode[courier.transport] ? transport_routMode[courier.transport] : 'pedestrian';

    return {courier_id: courier.id, transport: transport, status: active_courier, route: false, points: points, orders_points: orders_points}
}

export const findMeta = (key, metaList) => {
    let metaObj = metaList.find(meta => meta.key === key);

    return !!metaObj ? metaObj.value : '';
}

export const getOrderStatusColor = (status) => {
   const colorsMap = {
       pending: '#828282',
       processing: '#386b98',
       ready: '#eda411',
       making: '#96588a',
       done: '#559f55',
       kurier: '#ef6c00',
       wait_stock: '#559f55',
       completed: '#559f55',
       cancelled: '#828282',
       refunded: '#828282',

   }

    return !!colorsMap[status] ? colorsMap[status] : 'red';
}

export const prepareOrderItemData = (order) => {

    let code = findMeta('enter_code', order.meta_data);
    let entrance = findMeta('entrance', order.meta_data);
    let apartment = findMeta('apartment', order.meta_data);


    order.delivery_code = !!(order.shipping_lines[0]) ? order.shipping_lines[0].method_id : 'local_pickup'; //!!велосипед(иногда приходит пустой shipping_lines)
    order.is_pickup = order.delivery_code == 'local_pickup';
    order.delivery_name = order.is_pickup ? 'Самовывоз' : 'Доставка';
    order.address_to = !order.is_pickup ? {
        "sity": order.shipping.city,
        "streetName": order.shipping.address_1,
        "streetAddress": order.shipping.address_1,
        "address": order.shipping.city,
        "floor": order.shipping.company,
        "flat": !!order.shipping.address_2 ? order.shipping.address_2 : (apartment ? apartment : ''),
        "code": code || '',
        "entrance": entrance || '',

    }
    : {}

    order.address_string = '';
    if (!order.is_pickup) {
        order.address_string = `${order.shipping.city} ${order.shipping.address_1}\n`;
        order.address_string += order.shipping.company ? 'этаж ' + order.shipping.company+'\n' : '';
        order.address_string += order.address_to.flat ? 'квартира ' + order.address_to.flat+'\n' : '';
        order.address_string += entrance ? 'подъезд ' + entrance+'\n' : '';
        order.address_string += code ? 'домофон ' + code+'\n' : '';

    } else {
        order.address_string = findMeta('local_pickup_name', order.meta_data);
    }

    order.client = {
        'name': order.billing.first_name ? order.billing.first_name : `Гость`,
        'phone': order.billing.phone,
        'email': order.billing.email,
    }
    order.coordinates_to = findMeta('lat', order.meta_data) + ', ' + findMeta('long', order.meta_data);
    order.payment_type = order.payment_method_title;
    order.billing_gatetimecheckout = findMeta('billing_gatetimecheckout', order.meta_data);
    // order.deliveryTimerPretty = dateDiff(Date.parse(order.order_close_time), new Date());
    // order.deliveryTimer = timeDiff(Date.parse(order.order_close_time), new Date());

    order.deliveryTimerPretty = '';
    order.deliveryTimer = '';
    order.productsTotal = '';

    //Добавляем поле cost_price из мета данных
    order.line_items.map((order_item) => order_item.cost_price = findMeta('_cost_price', order_item.meta_data ) || 0)

    order.productsTotal = order.line_items.reduce( (Sum, product) => Sum + Number(product.subtotal), 0);
    order.couponsTotal = order.coupon_lines.reduce( (Sum, coupon) => Sum + Number(coupon.discount), 0) * -1;
    order.shippingTotal = order.shipping_lines.reduce( (Sum, coupon) => Sum + Number(coupon.total), 0);
    order.feeTotal = order.fee_lines.reduce( (Sum, fee) => Sum + Number(fee.total), 0) * -1;

    return order;
}

export const translateStatus = (order_status, statuces) => {
    console.log('statuces', order_status,  statuces);
    let finded_status = statuces.find( status => status.code === order_status );

    return !!finded_status ? finded_status.name : order_status;

}
export default getCourierRouteObj;