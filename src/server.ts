import dotenv from "dotenv";

process.on("uncaughtException", (err: Error) => {
    console.log("UNCAUGHT EXCEPTION: Shutting down...");
    console.log(`${err.name}: ${err.message}`);
    console.log(err.stack);
    process.exit(1);
});

dotenv.config({ path: "../.env" });

import app from "./app.js";
import { type Server } from "node:http";

const port: string | number = process.env.PORT || 3000;
const server: Server = app.listen(port, () => {
    console.log(`App running on port ${port}`);
});

process.on("unhandledRejection", (err: Error) => {
    console.log("UNHANDLED REJECTION: Shutting down...");
    console.log(`${err.name}: ${err.message}`);
    server.close(() => process.exit(1));
});
