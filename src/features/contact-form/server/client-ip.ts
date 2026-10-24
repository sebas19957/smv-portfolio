const PRIVATE_IP = /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|::1|fc|fd)/i;

/**
 * Real public IP of the visitor. The site sits behind Cloudflare, which rewrites
 * `x-forwarded-for` with its own edge addresses, so `cf-connecting-ip` wins; the rest are
 * fallbacks for environments without Cloudflare (local, direct hits).
 */
export function getClientIp(headers: Headers): string {
  const cfIp = headers.get('cf-connecting-ip')?.trim();
  if (cfIp) return cfIp;

  const trueClientIp = headers.get('true-client-ip')?.trim();
  if (trueClientIp) return trueClientIp;

  const forwarded = (headers.get('x-forwarded-for') ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  const forwardedIp = forwarded.find((ip) => !PRIVATE_IP.test(ip)) ?? forwarded[0];
  if (forwardedIp) return forwardedIp;

  return headers.get('x-real-ip')?.trim() || 'unknown';
}
