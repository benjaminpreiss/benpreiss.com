import { spawn } from "node:child_process";
import { createFixtureSite } from "./site.ts";

const site = createFixtureSite();
const build = site.build();
if (build.status !== 0) {
  console.error(build.stdout, build.stderr);
  site.cleanup();
  process.exit(1);
}
const server = spawn(
  process.execPath,
  [site.astro, "preview", "--ignore-lock", "--host", "127.0.0.1", "--port", "44321"],
  {
    cwd: site.dir,
    stdio: "inherit",
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: "1" },
  },
);
process.on("SIGTERM", () => server.kill("SIGTERM"));
process.on("SIGINT", () => server.kill("SIGINT"));
server.on("error", (error) => {
  console.error(error);
  site.cleanup();
  process.exit(1);
});
server.on("exit", (code) => {
  site.cleanup();
  process.exit(code ?? 0);
});
