import { createRouter } from "@/lib/create-app";

import * as handler from "./tasks.handler";
import * as routes from "./tasks.route";

const router = createRouter()
  .openapi(routes.list, handler.list)
  .openapi(routes.create, handler.create)
  .openapi(routes.getOne, handler.getOne)
  .openapi(routes.patch, handler.patch)
  .openapi(routes.remove, handler.remove);

export default router;
