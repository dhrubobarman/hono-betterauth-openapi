import type { Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";

import type { AppBindings, AppOpenAPI } from "@/lib/types";

import { authMiddleware } from "@/lib/auth";
import { logger, notFound, onError, serveEmojiFavicon } from "@/middlewares";
import { defaultHook } from "@/openapi";

export function createRouter() {
  const app = new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
  return app;
}

function createApp() {
  const app = createRouter();

  // Security & Global middleware
  app.use(serveEmojiFavicon("🧹"));
  app.use(logger());
  app.use("*", authMiddleware);

  app.notFound(notFound);
  app.onError(onError);

  return app;
}

export default createApp;

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route("/", router);
}
