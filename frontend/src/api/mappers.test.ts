import { describe, expect, it } from 'vitest';
import { DiscountType } from '../types/order';
import {
  mapOrderResponse,
  mapPromotionResponse,
  normalizePromotionType,
} from './mappers';

describe('normalizePromotionType', () => {
  it('maps backend aliases to DiscountType', () => {
    expect(normalizePromotionType('PERCENTAGE')).toBe(
      DiscountType.ORDER_PERCENTAGE,
    );
    expect(normalizePromotionType('BUY_X_GET_Y')).toBe(DiscountType.BUY_X_GET_Y);
    expect(normalizePromotionType('VIP')).toBe(DiscountType.VIP);
    expect(normalizePromotionType('COUPON')).toBe(DiscountType.COUPON);
  });

  it('defaults unknown types to ORDER_PERCENTAGE', () => {
    expect(normalizePromotionType('UNKNOWN')).toBe(
      DiscountType.ORDER_PERCENTAGE,
    );
  });
});

describe('mapOrderResponse', () => {
  it('maps numeric fields and preserves applied discounts', () => {
    const result = mapOrderResponse({
      subtotal: 100,
      discount: 10,
      finalPrice: 90,
      appliedDiscounts: [
        {
          code: 'ORDER10',
          name: '10% off',
          type: DiscountType.ORDER_PERCENTAGE,
          amount: 10,
        },
      ],
    });

    expect(result).toEqual({
      subtotal: 100,
      discount: 10,
      finalPrice: 90,
      appliedDiscounts: [
        {
          code: 'ORDER10',
          name: '10% off',
          type: DiscountType.ORDER_PERCENTAGE,
          amount: 10,
        },
      ],
    });
  });

  it('synthesizes a fallback discount row when only total discount is returned', () => {
    const result = mapOrderResponse({
      subtotal: 200,
      discount: 25,
      finalPrice: 175,
    });

    expect(result.appliedDiscounts).toEqual([
      {
        code: 'PROMOTION_PIPELINE',
        name: 'Applied backend promotions',
        type: DiscountType.ORDER_PERCENTAGE,
        amount: 25,
      },
    ]);
  });
});

describe('mapPromotionResponse', () => {
  it('maps backend promotion payload', () => {
    const promotion = mapPromotionResponse({
      id: 1,
      name: 'VIP Deal',
      type: 'VIP',
      value: 5,
      active: true,
    });

    expect(promotion.id).toBe('1');
    expect(promotion.type).toBe(DiscountType.VIP);
    expect(promotion.active).toBe(true);
  });
});
