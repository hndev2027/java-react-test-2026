import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CustomerType, type Product } from '../../types/order';
import { estimateSubtotal, sumQuantity } from '../../utils/orderTotals';
import { calculatePricing } from './orderSlice';
import {
  createLineItem,
  hasValidationErrors,
  toCalculateRequest,
  validateLineItems,
  type LineItemFormValue,
} from './orderValidation';

const initialItems: LineItemFormValue[] = [
  { id: crypto.randomUUID(), sku: 'A100', price: '100', quantity: '2' },
  { id: crypto.randomUUID(), sku: 'B200', price: '50', quantity: '1' },
];

export function useOrderForm() {
  const [customerType, setCustomerType] = useState(CustomerType.NORMAL);
  const [couponDraft, setCouponDraft] = useState('SUMMER10');
  const [appliedCoupon, setAppliedCoupon] = useState('SUMMER10');
  const [items, setItems] = useState<LineItemFormValue[]>(initialItems);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const lastStatus = useRef<'idle' | 'pending' | 'succeeded' | 'failed'>('idle');
  const dispatch = useAppDispatch();

  const calculation = useAppSelector((state) => state.order.calculation);
  const products = useAppSelector((state) => state.order.products);
  const coupons = useAppSelector((state) => state.order.coupons);

  const validationErrors = useMemo(() => validateLineItems(items), [items]);
  const hasErrors = hasValidationErrors(validationErrors);
  const isPending = calculation.status === 'pending';
  const estimatedSubtotal = useMemo(() => estimateSubtotal(items), [items]);
  const totalQuantity = useMemo(() => sumQuantity(items), [items]);
  const visibleErrors = submitAttempted ? validationErrors.items : {};

  useEffect(() => {
    if (
      lastStatus.current === 'pending' &&
      calculation.status === 'succeeded'
    ) {
      setSuccessOpen(true);
    }

    lastStatus.current = calculation.status;
  }, [calculation.status]);

  function updateItem(
    id: string,
    field: keyof Omit<LineItemFormValue, 'id'>,
    value: string,
  ) {
    if (field === 'sku') {
      const product = products.items.find(
        (productItem) => productItem.sku === value,
      );
      setItems((currentItems) =>
        currentItems.map((item) =>
          item.id === id
            ? {
                ...item,
                sku: value,
                price: product ? String(product.price) : item.price,
              }
            : item,
        ),
      );
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  function removeItem(id: string) {
    setItems((currentItems) => {
      if (currentItems.length === 1) {
        return currentItems;
      }

      return currentItems.filter((item) => item.id !== id);
    });
  }

  function usePreset(preset: Product) {
    setItems((currentItems) => {
      const emptyItem = currentItems.find((item) => !item.sku && !item.price);
      const presetItem = {
        id: emptyItem?.id ?? crypto.randomUUID(),
        sku: preset.sku,
        price: String(preset.price),
        quantity: '1',
      };

      if (!emptyItem) {
        return [...currentItems, presetItem];
      }

      return currentItems.map((item) =>
        item.id === emptyItem.id ? presetItem : item,
      );
    });
  }

  function addItem() {
    setItems((currentItems) => [...currentItems, createLineItem()]);
  }

  function applyCoupon() {
    setAppliedCoupon(couponDraft.trim().toUpperCase());
  }

  function submitCalculation() {
    setSubmitAttempted(true);

    if (hasErrors) {
      return;
    }

    dispatch(
      calculatePricing(
        toCalculateRequest({
          customerType,
          couponCode: appliedCoupon,
          items,
        }),
      ),
    );
  }

  return {
    customerType,
    setCustomerType,
    couponDraft,
    setCouponDraft,
    appliedCoupon,
    items,
    submitAttempted,
    successOpen,
    setSuccessOpen,
    calculation,
    products,
    coupons,
    hasErrors,
    isPending,
    estimatedSubtotal,
    totalQuantity,
    visibleErrors,
    updateItem,
    removeItem,
    usePreset,
    addItem,
    applyCoupon,
    submitCalculation,
  };
}
