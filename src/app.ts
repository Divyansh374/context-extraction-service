import express, { type Express } from "express";
import extractRouter from "./routes/extract.routes.js";

const app: Express = express();

app.use(express.json());

app.use("/api/v1/extract", extractRouter);

export default app;