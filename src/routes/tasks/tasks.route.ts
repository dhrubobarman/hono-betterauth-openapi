import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";

import { insertTaskSchema, patchTasksSchema, selectTasksSchema } from "@/db/schemas/tasks";
import * as HttpStatusCodes from "@/http-status-codes";
import { notFoundSchema } from "@/lib/constants";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "@/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "@/openapi/schemas";

const tags = ["Tasks"];

export const list = createRoute({
  path: "/tasks",
  method: "get",
  tags,

  responses: {
    [HttpStatusCodes.OK]: jsonContent(z.array(selectTasksSchema), "The list of tasks"),
  },
});

export const create = createRoute({
  path: "/tasks",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertTaskSchema,
      "The task to create",
    ),
  },
  tags,
  security: [{ betterAuth: [] }],
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTasksSchema, "Crated task"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(insertTaskSchema), "The validataion errors"),
  },
});

export const getOne = createRoute({
  path: "/tasks/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTasksSchema, "Requested tasks"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
  },
});

export const patch = createRoute({
  path: "/tasks/{id}",
  method: "patch",
  request: {
    params: IdParamsSchema,
    body: jsonContentRequired(
      patchTasksSchema,
      "The task to update",
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTasksSchema, "The task updated"),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf([createErrorSchema(patchTasksSchema), createErrorSchema(IdParamsSchema)], "The validataion error(s)"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
  },
});

export const remove = createRoute({
  path: "/tasks/{id}",
  method: "delete",
  request: {
    params: IdParamsSchema,
  },
  tags,
  responses: {
    [HttpStatusCodes.NO_CONTENT]: { description: "Task deleted" },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(createErrorSchema(IdParamsSchema), "Invalid id error"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, "Task not found"),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
