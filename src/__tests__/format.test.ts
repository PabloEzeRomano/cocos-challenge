import { formatCurrency, formatPercentage, formatQuantity } from '../utils/format';

describe('formatCurrency', () => {
  it('formats positive values', () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain('1');
    expect(result).toContain('234');
    expect(result).toContain('56');
    expect(result).toContain('$');
  });

  it('formats zero', () => {
    const result = formatCurrency(0);
    expect(result).toContain('0');
    expect(result).toContain('00');
  });

  it('formats negative values', () => {
    const result = formatCurrency(-500.5);
    expect(result).toContain('500');
    expect(result).toContain('50');
  });

  it('formats large numbers', () => {
    const result = formatCurrency(1000000);
    expect(result).toContain('$');
  });
});

describe('formatPercentage', () => {
  it('formats positive with plus sign', () => {
    expect(formatPercentage(5.123)).toBe('+5.12%');
  });

  it('formats negative without extra sign', () => {
    expect(formatPercentage(-3.456)).toBe('-3.46%');
  });

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0.00%');
  });

  it('formats small values', () => {
    expect(formatPercentage(0.001)).toBe('+0.00%');
  });
});

describe('formatQuantity', () => {
  it('formats integer', () => {
    const result = formatQuantity(1000);
    expect(result).toContain('1');
    expect(result).toContain('000');
  });

  it('formats small numbers', () => {
    expect(formatQuantity(5)).toBe('5');
  });
});
