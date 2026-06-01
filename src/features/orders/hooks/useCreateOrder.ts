import { useMutation } from '@tanstack/react-query';
import { submitOrder } from '../../../services/api';
import { OrderPayload, OrderResponse } from '../../../types/api';

export function useCreateOrder() {
  return useMutation<OrderResponse, Error, OrderPayload>({
    mutationFn: submitOrder,
  });
}
