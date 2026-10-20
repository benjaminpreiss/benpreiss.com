import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function normalizeMarkdoc(text: string): string {
  // Preserve trailing spaces (intentional hard breaks), indentation and tags.
  return text.replace(/\r\n?/g, "\n").replace(/\n*$/, "\n");
}

export function checkMarkdoc(files: string[], write: boolean): void {
  for (const file of files) {
    const original = readFileSync(file, "utf8");
    const formatted = normalizeMarkdoc(original);
    if (original === formatted) continue;
    if (write) writeFileSync(file, formatted);
    else throw new Error(`${file}: expected LF line endings and exactly one final newline`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const files = process.argv.slice(3);
  checkMarkdoc(
    files.length
      ? files
      : readdirSync("content", { recursive: true, encoding: "utf8" })
          .filter((file) => file.endsWith(".mdoc"))
          .map((file) => `content/${file}`),
    process.argv[2] === "--write",
  );
}
