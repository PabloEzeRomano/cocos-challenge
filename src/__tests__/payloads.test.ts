import { buildOrderPayload } from '../features/orders/utils/payloads';

describe('buildOrderPayload', () => {
  it('builds MARKET BUY payload', () => {
    const payload = buildOrderPayload({
      instrumentId: 1,
      side: 'BUY',
      type: 'MARKET',
      quantity: 100,
    });

    expect(payload).toEqual({
      instrument_id: 1,
      side: 'BUY',
      type: 'MARKET',
      quantity: 100,
    });
    expect(payload.price).toBeUndefined();
  });

  it('builds LIMIT SELL payload with price', () => {
    const payload = buildOrderPayload({
      instrumentId: 2,
      side: 'SELL',
      type: 'LIMIT',
      quantity: 50,
      price: 84.5,
    });

    expect(payload).toEqual({
      instrument_id: 2,
      side: 'SELL',
      type: 'LIMIT',
      quantity: 50,
      price: 84.5,
    });
  });

  it('omits price for MARKET orders even if provided', () => {
    const payload = buildOrderPayload({
      instrumentId: 1,
      side: 'BUY',
      type: 'MARKET',
      quantity: 10,
      price: 100,
    });

    expect(payload.price).toBeUndefined();
  });
});
