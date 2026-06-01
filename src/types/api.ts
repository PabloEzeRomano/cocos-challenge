export interface Instrument {
  id: number;
  ticker: string;
  name: string;
  type: string;
  last_price: number;
  close_price: number;
}

export interface PortfolioPosition {
  instrument_id: number;
  ticker: string;
  quantity: number;
  last_price: number;
  close_price: number;
  avg_cost_price: number;
}

export type OrderSide = 'BUY' | 'SELL';
export type OrderType = 'MARKET' | 'LIMIT';
export type OrderStatus = 'PENDING' | 'FILLED' | 'REJECTED';

export interface OrderPayload {
  instrument_id: number;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
}

export interface OrderResponse {
  id: number;
  status: OrderStatus;
}
