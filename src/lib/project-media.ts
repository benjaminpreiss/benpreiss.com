import { z } from "astro/zod";

const source = z.union([
  z.string().regex(/^\/(?!\/)[a-zA-Z0-9/_.-]+$/),
  z.url({ protocol: /^https?$/ }),
]);
const metadata = {
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  poster: source,
};

// Editorial URLs remain in Markdoc. HLS must be an explicit HTTPS manifest;
// file sources remain supported for deterministic tests and other recordings.
export const projectRecordingSchema = z.union([
  z
    .object({
      ...metadata,
      hls: z
        .url({ protocol: /^https$/ })
        .refine(
          (value) => new URL(value).pathname.endsWith(".m3u8"),
          "Expected an HLS manifest (.m3u8)",
        ),
    })
    .strict(),
  z.object({ ...metadata, webm: source, mp4: source }).strict(),
]);

export type ProjectRecording = z.infer<typeof projectRecordingSchema>;
