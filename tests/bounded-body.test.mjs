import assert from "node:assert/strict";
import test from "node:test";

import { readBoundedBody } from "../app/lib/bounded-body.ts";

test("reads a valid request body under the byte limit", async () => {
  const request = new Request("https://example.test/api/analyze", {
    method: "POST",
    body: JSON.stringify({ logData: "valid log content" }),
  });

  const result = await readBoundedBody(request, 1024);
  assert.deepEqual(result, {
    ok: true,
    text: JSON.stringify({ logData: "valid log content" }),
  });
});

test("rejects an oversized body even when Content-Length is absent", async () => {
  const request = new Request("https://example.test/api/analyze", {
    method: "POST",
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("x".repeat(100)));
        controller.close();
      },
    }),
    // Streaming requests can omit Content-Length; the stream must still be bounded.
    duplex: "half",
  });

  assert.equal(request.headers.get("content-length"), null);
  assert.deepEqual(await readBoundedBody(request, 64), {
    ok: false,
    reason: "too-large",
  });
});

test("rejects invalid UTF-8 instead of silently decoding replacement characters", async () => {
  const request = new Request("https://example.test/api/analyze", {
    method: "POST",
    body: new Uint8Array([0xff, 0xfe]),
  });

  assert.deepEqual(await readBoundedBody(request, 64), {
    ok: false,
    reason: "invalid-utf8",
  });
});
