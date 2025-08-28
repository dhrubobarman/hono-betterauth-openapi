import { auth } from "@/lib/auth";
import configureOpenAPI from "@/lib/configure-open-api";
import createApp from "@/lib/create-app";
import index from "@/routes/index.route";
import tasks from "@/routes/tasks/tasks.index";

const routes = [
  index,
  tasks,
] as const;

const app = createApp();
app.on(["POST", "GET"], "/api/auth/**", c => auth.handler(c.req.raw));

routes.forEach((route) => {
  app.route("/", route);
});

configureOpenAPI(app);

export default app;

export type AppType = typeof routes[number];
