import { OrderPayload, OrderSide, OrderType } from '../../../types/api';

interface BuildOrderPayloadParams {
  instrumentId: number;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
}

export function buildOrderPayload(params: BuildOrderPayloadParams): OrderPayload {
  const payload: OrderPayload = {
    instrument_id: params.instrumentId,
    side: params.side,
    type: params.type,
    quantity: params.quantity,
  };

  if (params.type === 'LIMIT' && params.price !== undefined) {
    payload.price = params.price;
  }

  return payload;
}
