import "dotenv/config";

const validEnvs = ["development", "production"];

if (process.env.NODE_ENV && !validEnvs.includes(process.env.NODE_ENV)) {
    console.error(`Invalid NODE_ENV=${process.env.NODE_ENV}. App is shutting down`);
    process.exit(1);
}

process.on("uncaughtException", (err: Error) => {
    console.log("UNCAUGHT EXCEPTION: Shutting down...");
    console.log(`${err.name}: ${err.message}`);
    console.log(err.stack);
    process.exit(1);
});

import app from "./app.js";
import { Server } from "node:http";

const port: number = Number(process.env.PORT) || 3000;
const server: Server = app.listen(port, "0.0.0.0", () => {
    console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
    console.log("UNHANDLED REJECTION: Shutting down...");
    console.log(`${err.name}: ${err.message}`);
    server.close(() => process.exit(1));
});
