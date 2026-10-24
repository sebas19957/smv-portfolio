import { describe, expect, it } from 'vitest';
import { getClientIp } from './client-ip';

const ip = (headers: Record<string, string>) => getClientIp(new Headers(headers));

describe('getClientIp', () => {
  it('prefers the Cloudflare visitor header over everything else', () => {
    expect(
      ip({
        'cf-connecting-ip': ' 203.0.113.7 ',
        'true-client-ip': '198.51.100.1',
        'x-forwarded-for': '104.16.0.1',
        'x-real-ip': '198.51.100.2',
      }),
    ).toBe('203.0.113.7');
  });

  it('falls back to true-client-ip', () => {
    expect(ip({ 'true-client-ip': '198.51.100.1', 'x-forwarded-for': '104.16.0.1' })).toBe('198.51.100.1');
  });

  it('takes the first public address from x-forwarded-for, skipping private ranges', () => {
    expect(ip({ 'x-forwarded-for': '10.0.0.3, 192.168.1.4, 172.20.0.1, 127.0.0.1, 203.0.113.9, 198.51.100.3' })).toBe(
      '203.0.113.9',
    );
    expect(ip({ 'x-forwarded-for': '::1, fd00::1, 2001:db8::1' })).toBe('2001:db8::1');
  });

  it('does not treat 172.x outside 16-31 as private', () => {
    expect(ip({ 'x-forwarded-for': '172.15.0.1, 203.0.113.9' })).toBe('172.15.0.1');
  });

  it('uses the first forwarded address when all of them are private', () => {
    expect(ip({ 'x-forwarded-for': '10.0.0.3, 192.168.1.4', 'x-real-ip': '198.51.100.2' })).toBe('10.0.0.3');
  });

  it('falls back to x-real-ip, then to "unknown"', () => {
    expect(ip({ 'x-forwarded-for': ' , ', 'x-real-ip': '198.51.100.2' })).toBe('198.51.100.2');
    expect(ip({})).toBe('unknown');
  });
});
