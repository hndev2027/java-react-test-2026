export enum CustomerType {
  NORMAL = "NORMAL",
  VIP = "VIP",
}

export enum DiscountType {
  ORDER_PERCENTAGE = "ORDER_PERCENTAGE",
  BUY_X_GET_Y = "BUY_X_GET_Y",
  VIP = "VIP",
  COUPON = "COUPON",
}

export type OrderItem = {
  sku: string;
  price: number;
  quantity: number;
};

export type Product = {
  id: number;
  sku: string;
  name: string;
  price: number;
};

export type Coupon = {
  id: number;
  code: string;
  discountType: "FIXED" | "PERCENT" | string;
  value: number;
  active: boolean;
};

export type CalculateOrderRequest = {
  customerType: CustomerType;
  items: OrderItem[];
  couponCode?: string;
};

export type AppliedDiscount = {
  code: string;
  name: string;
  type: DiscountType;
  amount: number;
};

export type PricingResult = {
  subtotal: number;
  discount: number;
  finalPrice: number;
  appliedDiscounts: AppliedDiscount[];
};

export type Promotion = {
  id: string;
  name: string;
  type: DiscountType;
  active: boolean;
  description: string;
  ruleSummary: string;
};

export type ApiErrorResponse = {
  code: string;
  message: string;
  details?: Record<string, string | string[]>;
};
