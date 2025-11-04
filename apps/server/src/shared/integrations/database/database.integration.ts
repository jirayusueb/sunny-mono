import { Elysia } from "elysia";

import { db } from "../../../db";

const databaseIntegration = new Elysia({
	name: "database-integration",
}).decorate("db", db);

export default databaseIntegration;
