import type { Context, Next } from "hono";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { jwt, openAPI, twoFactor } from "better-auth/plugins";

import type { UserType } from "@/db/schemas/user-auth/user";
// src/auth.ts
import type { AppBindings } from "@/lib/types";

import db from "@/db";
import env from "@/env";

// import * as HttpStatusCodes from "@/http-status-codes";

export const auth = betterAuth({
  plugins: [jwt(), openAPI(), twoFactor()],
  database: drizzleAdapter(db, { provider: "pg" }),
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID as string,
      clientSecret: env.GITHUB_CLIENT_SECRET as string,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  appName: "Zara Help",
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: false,
      },
    },
  },
});

export async function authMiddleware(c: Context<AppBindings, "*", object>, next: Next) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user as unknown as UserType);
  c.set("session", session.session);
  return next();
}
