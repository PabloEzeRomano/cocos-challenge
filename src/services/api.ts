import axios from 'axios';
import { Instrument, OrderPayload, OrderResponse, PortfolioPosition } from '../types/api';

const client = axios.create({
  baseURL: 'https://dummy-api-topaz.vercel.app',
  timeout: 10000,
});

export async function fetchInstruments(): Promise<Instrument[]> {
  const { data } = await client.get<Instrument[]>('/instruments');
  return data;
}

export async function fetchPortfolio(): Promise<PortfolioPosition[]> {
  const { data } = await client.get<PortfolioPosition[]>('/portfolio');
  return data;
}

export async function searchInstruments(query: string): Promise<Instrument[]> {
  const { data } = await client.get<Instrument[]>('/search', {
    params: { query },
  });
  return data;
}

export async function submitOrder(payload: OrderPayload): Promise<OrderResponse> {
  const { data } = await client.post<OrderResponse>('/orders', payload);
  return data;
}
