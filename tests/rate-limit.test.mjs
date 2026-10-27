import assert from "node:assert/strict";
import test from "node:test";

import {
  FixedWindowRateLimiter,
  getClientAddress,
} from "../app/lib/rate-limit.ts";

test("allows requests up to the fixed-window limit", () => {
  const limiter = new FixedWindowRateLimiter(2, 60_000);

  assert.deepEqual(limiter.consume("client-a", 0), {
    allowed: true,
    limit: 2,
    remaining: 1,
    retryAfterSeconds: 0,
  });
  assert.equal(limiter.consume("client-a", 1).allowed, true);
  assert.deepEqual(limiter.consume("client-a", 2), {
    allowed: false,
    limit: 2,
    remaining: 0,
    retryAfterSeconds: 60,
  });
});

test("keeps separate client buckets and resets at the next window", () => {
  const limiter = new FixedWindowRateLimiter(1, 60_000);

  assert.equal(limiter.consume("client-a", 100).allowed, true);
  assert.equal(limiter.consume("client-b", 100).allowed, true);
  assert.equal(limiter.consume("client-a", 59_999).allowed, false);
  assert.equal(limiter.consume("client-a", 60_000).allowed, true);
});

test("uses the right-most forwarded address and falls back safely", () => {
  assert.equal(
    getClientAddress(new Headers({ "x-forwarded-for": "spoofed, 203.0.113.7" })),
    "203.0.113.7",
  );
  assert.equal(
    getClientAddress(new Headers({ "x-real-ip": "203.0.113.8" })),
    "203.0.113.8",
  );
  assert.equal(getClientAddress(new Headers()), "unknown");
});

test("rejects invalid limiter configuration", () => {
  assert.throws(() => new FixedWindowRateLimiter(0, 60_000));
  assert.throws(() => new FixedWindowRateLimiter(5, 0));
});
