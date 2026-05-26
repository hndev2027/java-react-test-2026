import type { CalculateOrderRequest, CustomerType } from '../../types/order';

export type LineItemFormValue = {
  id: string;
  sku: string;
  price: string;
  quantity: string;
};

export type LineItemErrors = Partial<Record<'sku' | 'price' | 'quantity', string>>;

export type OrderFormErrors = {
  items: Record<string, LineItemErrors>;
};

export function createLineItem(): LineItemFormValue {
  return {
    id: crypto.randomUUID(),
    sku: '',
    price: '',
    quantity: '1',
  };
}

export function validateLineItems(items: LineItemFormValue[]): OrderFormErrors {
  const itemErrors: Record<string, LineItemErrors> = {};

  items.forEach((item) => {
    const errors: LineItemErrors = {};
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    if (!item.sku.trim()) {
      errors.sku = 'SKU is required';
    }

    if (!Number.isFinite(price) || price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.quantity = 'Quantity must be a positive integer';
    }

    if (Object.keys(errors).length > 0) {
      itemErrors[item.id] = errors;
    }
  });

  return { items: itemErrors };
}

export function hasValidationErrors(errors: OrderFormErrors) {
  return Object.keys(errors.items).length > 0;
}

export function toCalculateRequest(params: {
  customerType: CustomerType;
  couponCode: string;
  items: LineItemFormValue[];
}): CalculateOrderRequest {
  return {
    customerType: params.customerType,
    couponCode: params.couponCode.trim() || undefined,
    items: params.items.map((item) => ({
      sku: item.sku.trim(),
      price: Number(item.price),
      quantity: Number(item.quantity),
    })),
  };
}
