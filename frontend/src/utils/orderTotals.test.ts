import { describe, expect, it } from 'vitest';
import type { LineItemFormValue } from '../features/order/orderValidation';
import { estimateSubtotal, sumQuantity } from './orderTotals';

const items: LineItemFormValue[] = [
  { id: '1', sku: 'A100', price: '100', quantity: '2' },
  { id: '2', sku: 'B200', price: '50', quantity: '1' },
];

describe('orderTotals', () => {
  it('estimateSubtotal sums valid line totals', () => {
    expect(estimateSubtotal(items)).toBe(250);
  });

  it('estimateSubtotal ignores invalid numeric fields', () => {
    const invalid: LineItemFormValue[] = [
      { id: '1', sku: 'A', price: 'abc', quantity: '2' },
      { id: '2', sku: 'B', price: '10', quantity: 'x' },
    ];

    expect(estimateSubtotal(invalid)).toBe(0);
  });

  it('sumQuantity totals item quantities', () => {
    expect(sumQuantity(items)).toBe(3);
  });
});
