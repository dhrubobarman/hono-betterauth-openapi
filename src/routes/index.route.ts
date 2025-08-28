import { createRoute } from "@hono/zod-openapi";
// import { z } from "zod/v4";

import * as HttpStatusCodes from "@/http-status-codes";
import { createRouter } from "@/lib/create-app";
import { jsonContent } from "@/openapi/helpers";
import { createMessageObjectSchema } from "@/openapi/schemas";

const router = createRouter().openapi(createRoute({
  tags: ["Index"],
  method: "get",
  path: "/",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(createMessageObjectSchema("Task api"), "api index"),
  },
}), (c) => {
  return c.json({ message: "hi there" }, HttpStatusCodes.OK);
});

export default router;
