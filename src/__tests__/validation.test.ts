import {
  calculateQuantityFromAmount,
  validateOrderForm,
} from '../features/orders/utils/validation';

describe('validateOrderForm', () => {
  const baseValues = {
    quantity: '10',
    amount: '1000',
    price: '50',
    inputMode: 'quantity' as const,
    orderType: 'MARKET' as const,
    lastPrice: 100,
  };

  describe('quantity mode', () => {
    it('valid integer quantity', () => {
      const result = validateOrderForm(baseValues);
      expect(result.isValid).toBe(true);
    });

    it('rejects empty quantity', () => {
      const result = validateOrderForm({ ...baseValues, quantity: '' });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('order.validation.quantityRequired');
    });

    it('rejects zero quantity', () => {
      const result = validateOrderForm({ ...baseValues, quantity: '0' });
      expect(result.isValid).toBe(false);
    });

    it('rejects negative quantity', () => {
      const result = validateOrderForm({ ...baseValues, quantity: '-5' });
      expect(result.isValid).toBe(false);
    });

    it('rejects fractional quantity', () => {
      const result = validateOrderForm({ ...baseValues, quantity: '2.5' });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('order.validation.quantityInteger');
    });
  });

  describe('amount mode', () => {
    it('valid amount covering at least one share', () => {
      const result = validateOrderForm({
        ...baseValues,
        inputMode: 'amount',
        amount: '500',
      });
      expect(result.isValid).toBe(true);
    });

    it('rejects amount less than one share', () => {
      const result = validateOrderForm({
        ...baseValues,
        inputMode: 'amount',
        amount: '50',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('order.validation.amountMinimum');
    });

    it('rejects empty amount', () => {
      const result = validateOrderForm({
        ...baseValues,
        inputMode: 'amount',
        amount: '',
      });
      expect(result.isValid).toBe(false);
    });
  });

  describe('LIMIT order price', () => {
    it('valid price for LIMIT order', () => {
      const result = validateOrderForm({
        ...baseValues,
        orderType: 'LIMIT',
        price: '50',
      });
      expect(result.isValid).toBe(true);
    });

    it('rejects empty price for LIMIT order', () => {
      const result = validateOrderForm({
        ...baseValues,
        orderType: 'LIMIT',
        price: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('order.validation.priceRequired');
    });

    it('rejects zero price for LIMIT order', () => {
      const result = validateOrderForm({
        ...baseValues,
        orderType: 'LIMIT',
        price: '0',
      });
      expect(result.isValid).toBe(false);
    });

    it('ignores price for MARKET order', () => {
      const result = validateOrderForm({
        ...baseValues,
        orderType: 'MARKET',
        price: '',
      });
      expect(result.isValid).toBe(true);
    });
  });
});

describe('calculateQuantityFromAmount', () => {
  it('calculates whole shares from amount', () => {
    expect(calculateQuantityFromAmount(1000, 100)).toBe(10);
  });

  it('floors fractional shares', () => {
    expect(calculateQuantityFromAmount(250, 100)).toBe(2);
  });

  it('returns 0 when amount less than price', () => {
    expect(calculateQuantityFromAmount(50, 100)).toBe(0);
  });

  it('returns 0 when price is 0', () => {
    expect(calculateQuantityFromAmount(1000, 0)).toBe(0);
  });

  it('handles large amounts', () => {
    expect(calculateQuantityFromAmount(1000000, 84.5)).toBe(11834);
  });
});
