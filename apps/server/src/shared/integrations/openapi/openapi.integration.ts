import { openapi } from "@elysiajs/openapi";
import { fromTypes } from "@elysiajs/openapi/gen";

const databaseIntegration = openapi({
	references: fromTypes("src/index.ts"),
});

export default databaseIntegration;
