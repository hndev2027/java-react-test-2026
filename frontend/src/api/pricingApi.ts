import type {
  CalculateOrderRequest,
  Coupon,
  PricingResult,
  Product,
  Promotion,
} from '../types/order';
import {
  API_BASE_URL,
  fetchJson,
  shouldUseMockApi,
  sleep,
} from './config';
import {
  mapCouponResponse,
  mapOrderResponse,
  mapProductResponse,
  mapPromotionResponse,
  type BackendCouponResponse,
  type BackendOrderResponse,
  type BackendProductResponse,
  type BackendPromotionResponse,
} from './mappers';
import { mockCoupons, mockProducts, mockPromotions } from './mock/catalog';
import { calculateMockPricing } from './mock/pricingEngine';

export async function calculateOrder(
  request: CalculateOrderRequest,
): Promise<PricingResult> {
  if (shouldUseMockApi()) {
    await sleep(650);
    return calculateMockPricing(request);
  }

  const response = await fetchJson<BackendOrderResponse>(
    `${API_BASE_URL}/orders/calculate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(request),
    },
  );

  return mapOrderResponse(response);
}

export async function getPromotions(): Promise<Promotion[]> {
  if (shouldUseMockApi()) {
    await sleep(300);
    return mockPromotions;
  }

  const promotions = await fetchJson<BackendPromotionResponse[]>(
    `${API_BASE_URL}/promotions`,
    { headers: { Accept: 'application/json' } },
  );

  return promotions.map(mapPromotionResponse);
}

export async function getProducts(): Promise<Product[]> {
  if (shouldUseMockApi()) {
    await sleep(300);
    return mockProducts;
  }

  const products = await fetchJson<BackendProductResponse[]>(
    `${API_BASE_URL}/products`,
    { headers: { Accept: 'application/json' } },
  );

  return products.map(mapProductResponse);
}

export async function getCoupons(): Promise<Coupon[]> {
  if (shouldUseMockApi()) {
    await sleep(300);
    return mockCoupons;
  }

  const coupons = await fetchJson<BackendCouponResponse[]>(
    `${API_BASE_URL}/coupons`,
    { headers: { Accept: 'application/json' } },
  );

  return coupons.map(mapCouponResponse);
}
