export type RoomType = {
  _id: string;
  roomNumber: number | string;
  countReviews?: number;
  rate?: number;
  images?: Array<string>;
  price: number;
  type?: 'Стандарт' | 'Люкс';
  comforts?: Array<string>;
  bookings?: Array<string> | null;
  hasWifi?: boolean;
  hasConditioner?: boolean;
  hasWorkSpace?: boolean;
  canSmoke?: boolean;
  canPets?: boolean;
  canInvite?: boolean;
  hasWideCorridor?: boolean;
  hasDisabledAssistant?: boolean;
};
export type AddressData = {
  sity: string;
  streetName: string;
  streetAddress: string;
  address: string;
  entrance: string;
  floor: string;
  flat: string;
}
export type OrderProducts = {
  id: string;
  image: {
    src: string
  };
  name: string;
  price: string;
  cost_price: string;
  quantity: string;
  sku: string;
}
export type OrderCoupons = {
  id: string;
  code: string;
  discount: string;
}
export type OrderShipping = {
  id: string;
  method_title: string;
  total: string;
}

export type OrderStatusType = {
    code: string,
    name: string,
}

export type OrderType = {
  _id: number;
  id: number;
  is_pickup: boolean;
  date_created: Date | string;
  address_from: number | string;
  address_to: AddressData;
  client_id: number;  
  coordinates_from: string;
  coordinates_to: string;
  courier: CourierType; 
  description?: string
  number: number;   
  order_close_at: Date | string;   
  order_close_time: Date | string;

  deliveryTimer: number;
  deliveryTimerPretty: string;
  routeDistance: string;
  routeTime: string;

  order_created_at: Date | string;   
  order_delivery_start_at: Date | string; 
  price: number;
  award: number;
  status: string;
  payment_type: string;
  customer_note: string;
  delivery_name: string;
  address_string: string;
  payment_method_title: string;
  client: Client,
  line_items: Array<OrderProducts>,
  delivery_price: number,
  total: number,
  courier_id: number | null,
  billing_gatetimecheckout: string,
  coupon_lines: Array<OrderCoupons>,
  shipping_lines: Array<OrderShipping>,

  productsTotal: number;
  couponsTotal: number;
  shippingTotal: number;
  feeTotal: number;
 // address_data: AddressData
};

export type CourierType = {
  _id: number;
  id: number;
  last_name: string;
  otchestvo: string;
  first_name: string; 
  fio: string; 
  avatar: string | undefined;   
  coordinates: string | null; 
  score: string; 
  rating: string; 
  status: string;   
  transport: string;
  routeTime: string;
  routeDistance: string;
  current_order: number | null,
  orders: Array<OrderTypeMini>,
  show_route: boolean,
};
export type Client = {
  _id?: string;
  name: string;
  phone: string;
  email: string;
}
export type OrderTypeMini = {
  id: number;
  address_from: number | string;
  address_to: AddressData;
  client_id: number;  
  coordinates_from: string;
  coordinates_to: string;
  number: number;   
  order_close_at: Date | string;   
  order_close_time: Date | string;
  order_created_at: Date | string;   
  order_delivery_start_at: Date | string;
  price: number;
  award: number;
  status: string;
  courier_id: number | null,
  payment_type: string;
  customer_note: string;
  client: Client,
 // address_data: AddressData 
};
export type BookingType = {
  _id?: string;
  adults: number;
  babies: number;
  children: number;
  arrivalDate: Date;
  departureDate: Date;
  roomId: string;
  userId: string;
  totalPrice: number;
  expires_at?: number;
};

export type UserType = {
  _id?: string;
  firstName: string;
  secondName: string;
  subscribe?: boolean;
  birthYear: Date | number;
  avatarPhoto?: string;
  domain_name?: string;
  stock_id?: number;
  email?: string;
  password?: string;
  role: 'user' | 'admin';
  gender: 'male' | 'female';

};

export type ReviewType = {
  _id?: string;
  content: string;
  rating: number;
  roomId: string;
  userId?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
};

export type LikeType = {
  _id: string;
  reviewId: string;
  userId: string;
  created_at?: Date;
  updated_at?: Date;
};

export type SignInDataType = {
  login: string;
  password: string;
};

