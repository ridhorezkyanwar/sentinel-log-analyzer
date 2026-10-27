import assert from "node:assert/strict";
import test from "node:test";

import {
  LogAnalysisSchema,
  MAX_LOG_CHARACTERS,
} from "../app/lib/log-schema.ts";

test("accepts normal log input and trims surrounding whitespace", () => {
  const parsed = LogAnalysisSchema.parse({ logData: "  repeated failed login attempts  " });
  assert.equal(parsed.logData, "repeated failed login attempts");
});

test("rejects log input shorter than the minimum", () => {
  const result = LogAnalysisSchema.safeParse({ logData: "short" });
  assert.equal(result.success, false);
});

test("rejects log input above the maximum size", () => {
  const result = LogAnalysisSchema.safeParse({
    logData: "x".repeat(MAX_LOG_CHARACTERS + 1),
  });
  assert.equal(result.success, false);
});

test("rejects non-string input and unexpected request fields", () => {
  assert.equal(LogAnalysisSchema.safeParse({ logData: 42 }).success, false);
  assert.equal(
    LogAnalysisSchema.safeParse({
      logData: "valid log snippet",
      isAdmin: true,
    }).success,
    false,
  );
});
