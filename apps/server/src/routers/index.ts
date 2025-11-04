import { Elysia } from "elysia";

import { healthRouter } from "./health";

export const routers = new Elysia().use(healthRouter);
