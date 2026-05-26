import { describe, expect, it } from 'vitest';
import {
  hasValidationErrors,
  toCalculateRequest,
  validateLineItems,
} from './orderValidation';

describe('order validation', () => {
  it('rejects rows with missing sku, non-positive price, or invalid quantity', () => {
    const errors = validateLineItems([
      { id: 'row-1', sku: '', price: '0', quantity: '1.5' },
    ]);

    expect(hasValidationErrors(errors)).toBe(true);
    expect(errors.items['row-1']).toEqual({
      sku: 'SKU is required',
      price: 'Price must be greater than 0',
      quantity: 'Quantity must be a positive integer',
    });
  });

  it('maps form values into the API request contract', () => {
    const request = toCalculateRequest({
      customerType: 'VIP',
      couponCode: ' SUMMER10 ',
      items: [{ id: 'row-1', sku: ' A100 ', price: '100', quantity: '2' }],
    });

    expect(request).toEqual({
      customerType: 'VIP',
      couponCode: 'SUMMER10',
      items: [{ sku: 'A100', price: 100, quantity: 2 }],
    });
  });
});
