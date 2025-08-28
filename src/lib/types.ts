import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { Session } from "better-auth";
import type { Schema } from "hono";
import type { PinoLogger } from "hono-pino";

import type { UserType } from "@/db/schemas/user-auth/user";

export interface AppBindings {
  Variables: {
    logger: PinoLogger;
    user: UserType | null;
    session: Session | null;
  };
}

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;
