// Hono OpenAPI generation

import { Scalar } from "@scalar/hono-api-reference";
import { isErrorResult, merge } from "openapi-merge";

import type { AppOpenAPI } from "@/lib/types";

import { auth } from "@/lib/auth";
// If you’re already creating specs via zod-openapi decorators, you can call .getOpenAPIDocument()

import packageJson from "../../package.json";

export default function configureOpenAPI(app: AppOpenAPI) {
  // Serve merged JSON spec
  app.get("/doc", async (c) => {
    // 1. Your app spec

    const appSpec = app.getOpenAPIDocument({
      openapi: "3.0.0",
      info: {
        version: packageJson.version,
        title: "Zara help",
      },
    });

    // 2. Better Auth spec
    const authSpec = await auth.api.generateOpenAPISchema();

    authSpec.servers = [
      { url: "http://localhost:4000" },
    ];

    if (authSpec.paths) {
      for (const path of Object.keys(authSpec.paths)) {
        const methods = authSpec.paths[path] as any;
        for (const method of Object.keys(methods)) {
          const op = methods[method];
          op.tags = ["Auth"];
        }
      }
    }

    // 3. Merge — prefix Better Auth paths so they match runtime routes
    const merged = merge([
      { oas: appSpec as any },
      { oas: authSpec as any, pathModification: { prepend: "/api/auth" } },
    ]);

    if (isErrorResult(merged)) {
      return c.json({ error: merged.message }, 500);
    }

    return c.json(merged.output);
  });

  // Scalar UI for merged spec
  app.get(
    "/reference",
    Scalar({
      url: "/doc", // unified spec above
      theme: "kepler",
      layout: "classic",
      defaultHttpClient: {
        targetKey: "js",
        clientKey: "fetch",
      },
    }),
  );
}
