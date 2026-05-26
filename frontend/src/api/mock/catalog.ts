import { DiscountType } from '../../types/order';
import type { Coupon, Product, Promotion } from '../../types/order';

export const mockPromotions: Promotion[] = [
  {
    id: 'ORDER10',
    name: '10% Order Discount',
    type: DiscountType.ORDER_PERCENTAGE,
    active: true,
    description: 'Applies 10% off when the order subtotal reaches 100 or more.',
    ruleSummary: 'subtotal >= 100 => subtotal * 10%',
  },
  {
    id: 'BUY2GET1',
    name: 'Buy 2 Get 1 Free',
    type: DiscountType.BUY_X_GET_Y,
    active: true,
    description: 'For each SKU, every third unit is free.',
    ruleSummary: 'free units = floor(quantity / 3)',
  },
  {
    id: 'VIP5',
    name: 'VIP Extra Discount',
    type: DiscountType.VIP,
    active: true,
    description: 'VIP customers receive an additional 5% discount on subtotal.',
    ruleSummary: 'customerType == VIP => subtotal * 5%',
  },
  {
    id: 'SUMMER10',
    name: 'SUMMER10 Coupon',
    type: DiscountType.COUPON,
    active: true,
    description: 'Flat 10 discount for a valid coupon code.',
    ruleSummary: 'couponCode == SUMMER10 => 10',
  },
];

export const mockProducts: Product[] = [
  { id: 1, sku: 'A100', name: 'Product A', price: 100 },
  { id: 2, sku: 'B200', name: 'Product B', price: 50 },
  { id: 3, sku: 'C300', name: 'Product C', price: 30 },
  { id: 4, sku: 'D400', name: 'Product D', price: 200 },
  { id: 5, sku: 'E500', name: 'Product E', price: 80 },
];

export const mockCoupons: Coupon[] = [
  { id: 1, code: 'SUMMER10', discountType: 'FIXED', value: 10, active: true },
  { id: 2, code: 'VIP30', discountType: 'PERCENT', value: 30, active: true },
  { id: 3, code: 'SAVE20', discountType: 'FIXED', value: 20, active: true },
];
