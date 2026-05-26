import type { LineItemFormValue } from '../features/order/orderValidation';

export function estimateSubtotal(items: LineItemFormValue[]): number {
  return items.reduce((total, item) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    if (!Number.isFinite(price) || !Number.isFinite(quantity)) {
      return total;
    }

    return total + price * quantity;
  }, 0);
}

export function sumQuantity(items: LineItemFormValue[]): number {
  return items.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0,
  );
}
