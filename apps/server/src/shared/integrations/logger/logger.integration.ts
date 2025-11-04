import { Elysia } from "elysia";
import logixlysia from "logixlysia";

const loggerIntegration = new Elysia({ name: "logger-integration" }).use(
	logixlysia({
		config: {
			showStartupMessage: true,
			startupMessageFormat: "simple",
			timestamp: {
				translateTime: "yyyy-mm-dd HH:MM:ss",
			},
			ip: true,
			customLogFormat:
				"🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip}",
		},
	}),
);

export default loggerIntegration;
