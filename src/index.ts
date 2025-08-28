import app from "@/app";
import env from "@/env";

import "./db";

if (import.meta.main) {
  Bun.serve({
    fetch: app.fetch,
    port: env.PORT,
  });
  // eslint-disable-next-line no-console
  console.log(`Server running on http://localhost:${env.PORT}`);
}
