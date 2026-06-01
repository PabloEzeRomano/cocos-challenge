import { OrderType } from '../../../types/api';

export interface OrderFormValues {
  quantity: string;
  amount: string;
  price: string;
  inputMode: 'quantity' | 'amount';
  orderType: OrderType;
  lastPrice: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateOrderForm(values: OrderFormValues): ValidationResult {
  const { inputMode, orderType, quantity, amount, price, lastPrice } = values;

  if (inputMode === 'quantity') {
    const qty = Number(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      return { isValid: false, error: 'order.validation.quantityRequired' };
    }
    if (!Number.isInteger(qty)) {
      return { isValid: false, error: 'order.validation.quantityInteger' };
    }
  } else {
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt < lastPrice) {
      return { isValid: false, error: 'order.validation.amountMinimum' };
    }
  }

  if (orderType === 'LIMIT') {
    const p = Number(price);
    if (!price || isNaN(p) || p <= 0) {
      return { isValid: false, error: 'order.validation.priceRequired' };
    }
  }

  return { isValid: true };
}

export function calculateQuantityFromAmount(amount: number, lastPrice: number): number {
  if (lastPrice <= 0) return 0;
  return Math.floor(amount / lastPrice);
}
