export type RateLimitDecision = {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
};

type Bucket = {
  windowStart: number;
  count: number;
};

/**
 * Best-effort in-memory fixed-window limiter for a single application runtime.
 * This is useful for a small public demo but is not a distributed, durable quota.
 */
export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly maxKeys = 10_000,
  ) {
    if (!Number.isInteger(limit) || limit < 1) {
      throw new Error("limit must be a positive integer");
    }
    if (!Number.isInteger(windowMs) || windowMs < 1) {
      throw new Error("windowMs must be a positive integer");
    }
    if (!Number.isInteger(maxKeys) || maxKeys < 1) {
      throw new Error("maxKeys must be a positive integer");
    }
  }

  consume(key: string, now = Date.now()): RateLimitDecision {
    const normalizedKey = key.trim() || "unknown";
    const windowStart = Math.floor(now / this.windowMs) * this.windowMs;
    const bucket = this.buckets.get(normalizedKey);

    if (!bucket || bucket.windowStart !== windowStart) {
      this.buckets.set(normalizedKey, { windowStart, count: 0 });
    }

    const current = this.buckets.get(normalizedKey)!;
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowStart + this.windowMs - now) / 1000),
    );

    if (current.count >= this.limit) {
      this.prune(windowStart);
      return {
        allowed: false,
        limit: this.limit,
        remaining: 0,
        retryAfterSeconds,
      };
    }

    current.count += 1;
    this.buckets.set(normalizedKey, current);
    this.prune(windowStart);

    return {
      allowed: true,
      limit: this.limit,
      remaining: Math.max(0, this.limit - current.count),
      retryAfterSeconds: 0,
    };
  }

  private prune(activeWindowStart: number): void {
    if (this.buckets.size <= this.maxKeys) return;

    for (const [key, value] of this.buckets) {
      if (value.windowStart < activeWindowStart) {
        this.buckets.delete(key);
      }
    }

    while (this.buckets.size > this.maxKeys) {
      const oldestKey = this.buckets.keys().next().value;
      if (oldestKey === undefined) break;
      this.buckets.delete(oldestKey);
    }
  }
}

/**
 * Vercel supplies X-Forwarded-For at the edge. Prefer the right-most hop so
 * an incoming client-supplied left-most value is not trusted if a proxy appends
 * its own address. If no address is available, the shared "unknown" bucket
 * intentionally fails closed rather than allowing unlimited unkeyed requests.
 */
export function getClientAddress(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const hops = forwardedFor
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }

  return headers.get("x-real-ip")?.trim() || "unknown";
}
