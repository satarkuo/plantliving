export type Coupon = {
  id: string;
  num: number;
  title: string;
  is_enabled: number;
  percent: number;
  due_date: number;
  code: string;
};

export type CreateCouponParams = Omit<Coupon, 'id' | 'num'>;
export type EditCouponParams = { id: string; data: CreateCouponParams };
export type Pagination = {
  total_pages: number;
  current_page: number;
  has_pre: boolean;
  has_next: boolean;
  category: string;
};

export type GetCouponsResponse = {
  success: boolean;
  coupons: Coupon[];
  pagination: {
    total_pages: number;
    current_page: number;
    has_pre: boolean;
    has_next: boolean;
    category: string;
  };
  messages: unknown[];
};
type MessageResponse = {
  success: boolean;
  message: string;
};

export type CreateCouponResponse = MessageResponse;
export type EditCouponResponse = MessageResponse;
export type DeleteCouponResponse = MessageResponse;
