import { CustomerType, DiscountType } from '../../types/order';
import type { CalculateOrderRequest, PricingResult } from '../../types/order';

function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateMockPricing(
  request: CalculateOrderRequest,
): PricingResult {
  const subtotal = roundCurrency(
    request.items.reduce((total, item) => total + item.price * item.quantity, 0),
  );

  const appliedDiscounts: PricingResult['appliedDiscounts'] = [];

  if (subtotal >= 100) {
    appliedDiscounts.push({
      code: 'ORDER10',
      name: '10% Order Discount',
      type: DiscountType.ORDER_PERCENTAGE,
      amount: roundCurrency(subtotal * 0.1),
    });
  }

  const buyTwoGetOneAmount = request.items.reduce((total, item) => {
    const freeUnits = Math.floor(item.quantity / 3);
    return total + freeUnits * item.price;
  }, 0);

  if (buyTwoGetOneAmount > 0) {
    appliedDiscounts.push({
      code: 'BUY2GET1',
      name: 'Buy 2 Get 1 Free',
      type: DiscountType.BUY_X_GET_Y,
      amount: roundCurrency(buyTwoGetOneAmount),
    });
  }

  if (request.customerType === CustomerType.VIP) {
    appliedDiscounts.push({
      code: 'VIP5',
      name: 'VIP Extra Discount',
      type: DiscountType.VIP,
      amount: roundCurrency(subtotal * 0.05),
    });
  }

  if (request.couponCode?.trim().toUpperCase() === 'SUMMER10') {
    appliedDiscounts.push({
      code: 'SUMMER10',
      name: 'SUMMER10 Coupon',
      type: DiscountType.COUPON,
      amount: 10,
    });
  }

  const discount = roundCurrency(
    Math.min(
      subtotal,
      appliedDiscounts.reduce(
        (total, discountItem) => total + discountItem.amount,
        0,
      ),
    ),
  );

  return {
    subtotal,
    discount,
    finalPrice: roundCurrency(subtotal - discount),
    appliedDiscounts,
  };
}
