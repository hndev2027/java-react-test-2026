import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { calculateOrder, getCoupons, getProducts, getPromotions } from '../../api/pricingApi';
import type {
  CalculateOrderRequest,
  Coupon,
  PricingResult,
  Promotion,
  Product,
} from '../../types/order';
import type { AsyncStatus } from '../../types/common';

type OrderState = {
  calculation: {
    status: AsyncStatus;
    result: PricingResult | null;
    error: string | null;
  };
  promotions: {
    status: AsyncStatus;
    items: Promotion[];
    error: string | null;
  };
  products: {
    status: AsyncStatus;
    items: Product[];
    error: string | null;
  };
  coupons: {
    status: AsyncStatus;
    items: Coupon[];
    error: string | null;
  };
};

const initialState: OrderState = {
  calculation: {
    status: 'idle',
    result: null,
    error: null,
  },
  promotions: {
    status: 'idle',
    items: [],
    error: null,
  },
  products: {
    status: 'idle',
    items: [],
    error: null,
  },
  coupons: {
    status: 'idle',
    items: [],
    error: null,
  },
};

export const calculatePricing = createAsyncThunk(
  'order/calculatePricing',
  async (request: CalculateOrderRequest) => calculateOrder(request),
);

export const fetchPromotions = createAsyncThunk(
  'order/fetchPromotions',
  async () => getPromotions(),
);

export const fetchProducts = createAsyncThunk(
  'order/fetchProducts',
  async () => getProducts(),
);

export const fetchCoupons = createAsyncThunk(
  'order/fetchCoupons',
  async () => getCoupons(),
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calculatePricing.pending, (state) => {
        state.calculation.status = 'pending';
        state.calculation.error = null;
      })
      .addCase(calculatePricing.fulfilled, (state, action) => {
        state.calculation.status = 'succeeded';
        state.calculation.result = action.payload;
      })
      .addCase(calculatePricing.rejected, (state, action) => {
        state.calculation.status = 'failed';
        state.calculation.error =
          action.error.message ?? 'Unable to calculate order pricing.';
      })
      .addCase(fetchPromotions.pending, (state) => {
        state.promotions.status = 'pending';
        state.promotions.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.promotions.status = 'succeeded';
        state.promotions.items = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.promotions.status = 'failed';
        state.promotions.error =
          action.error.message ?? 'Unable to load promotions.';
      })
      .addCase(fetchProducts.pending, (state) => {
        state.products.status = 'pending';
        state.products.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.status = 'succeeded';
        state.products.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.status = 'failed';
        state.products.error =
          action.error.message ?? 'Unable to load products.';
      })
      .addCase(fetchCoupons.pending, (state) => {
        state.coupons.status = 'pending';
        state.coupons.error = null;
      })
      .addCase(fetchCoupons.fulfilled, (state, action) => {
        state.coupons.status = 'succeeded';
        state.coupons.items = action.payload;
      })
      .addCase(fetchCoupons.rejected, (state, action) => {
        state.coupons.status = 'failed';
        state.coupons.error =
          action.error.message ?? 'Unable to load coupons.';
      });
  },
});

export default orderSlice.reducer;
