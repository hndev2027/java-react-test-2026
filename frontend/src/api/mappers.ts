import { DiscountType } from '../types/order';
import type { Coupon, PricingResult, Product, Promotion } from '../types/order';

export type BackendOrderResponse = {
  subtotal: number;
  discount: number;
  finalPrice: number;
  appliedDiscounts?: PricingResult['appliedDiscounts'];
};

export type BackendPromotionResponse = {
  id: number;
  name: string;
  type: string;
  value: number;
  active: boolean;
};

export type BackendProductResponse = {
  id: number;
  sku: string;
  name: string;
  price: number;
};

export type BackendCouponResponse = {
  id: number;
  code: string;
  discountType: string;
  value: number;
  active: boolean;
};

export function normalizePromotionType(type: string): DiscountType {
  const normalized = type?.trim().toUpperCase();

  if (normalized === 'PERCENTAGE' || normalized === 'ORDER_PERCENTAGE') {
    return DiscountType.ORDER_PERCENTAGE;
  }

  if (normalized === 'BUY_X_GET_Y') {
    return DiscountType.BUY_X_GET_Y;
  }

  if (normalized === 'VIP') {
    return DiscountType.VIP;
  }

  if (normalized === 'COUPON') {
    return DiscountType.COUPON;
  }

  return DiscountType.ORDER_PERCENTAGE;
}

export function mapOrderResponse(response: BackendOrderResponse): PricingResult {
  const discount = Number(response.discount);
  const appliedDiscounts = response.appliedDiscounts?.map((discountItem) => ({
    ...discountItem,
    amount: Number(discountItem.amount),
  }));

  return {
    subtotal: Number(response.subtotal),
    discount,
    finalPrice: Number(response.finalPrice),
    appliedDiscounts:
      appliedDiscounts ??
      (discount > 0
        ? [
            {
              code: 'PROMOTION_PIPELINE',
              name: 'Applied backend promotions',
              type: DiscountType.ORDER_PERCENTAGE,
              amount: discount,
            },
          ]
        : []),
  };
}

export function mapPromotionResponse(
  response: BackendPromotionResponse,
): Promotion {
  const type = normalizePromotionType(response.type);

  return {
    id: String(response.id),
    name: response.name || `Promotion #${response.id}`,
    type,
    active: Boolean(response.active),
    description: `${response.name || 'Promotion'} is ${response.active ? 'active' : 'paused'}.`,
    ruleSummary: `${type} value = ${Number(response.value ?? 0)}`,
  };
}

export function mapProductResponse(response: BackendProductResponse): Product {
  return {
    id: response.id,
    sku: response.sku,
    name: response.name,
    price: Number(response.price),
  };
}

export function mapCouponResponse(response: BackendCouponResponse): Coupon {
  return {
    id: response.id,
    code: response.code,
    discountType: response.discountType,
    value: Number(response.value),
    active: Boolean(response.active),
  };
}
