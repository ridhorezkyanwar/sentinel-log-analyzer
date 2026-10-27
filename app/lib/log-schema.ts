import { z } from "zod";

export const MAX_LOG_CHARACTERS = 50_000;
export const MAX_REQUEST_BYTES = 64 * 1024;

export const LogAnalysisSchema = z
  .object({
    logData: z
      .string()
      .trim()
      .min(10, "Log data terlalu pendek")
      .max(
        MAX_LOG_CHARACTERS,
        `Log data maksimal ${MAX_LOG_CHARACTERS.toLocaleString("en-US")} karakter`
      ),
  })
  .strict();
