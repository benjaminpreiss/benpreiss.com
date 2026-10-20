import { z } from "astro/zod";
import ui from "../../content/ui.json" with { type: "json" };
import buttons from "../../content/technology-buttons.json" with { type: "json" };

const text = z.string().trim().min(1);
const destination = z.url({ protocol: /^https?$/ });
const asset = z.string().regex(/^\/(?!\/)[a-zA-Z0-9/_.-]+$/);
const localized = z
  .object({
    video: z
      .object({
        play: text,
        pause: text,
        blocked: text,
        failed: text,
        open: text,
        devices: z.object({ mobile: text, desktop: text }).strict(),
      })
      .strict(),
  })
  .strict();
const identity = z.string().regex(/^[a-z][a-z0-9-]*$/);

// Build-only validation: browser islands import JSON, not this module or Zod.
export const sharedContentSchema = z
  .object({
    ui: z.object({ de: localized, en: localized }).strict(),
    buttons: z.record(
      identity,
      z
        .object({
          label: text,
          href: destination,
          icon: asset,
          size: z.enum(["small", "medium", "wide"]),
        })
        .strict(),
    ),
  })
  .strict();

export function validateSharedContent() {
  const result = sharedContentSchema.safeParse({ ui, buttons });
  if (!result.success) throw new Error(`Invalid shared JSON content: ${result.error.message}`);
}
