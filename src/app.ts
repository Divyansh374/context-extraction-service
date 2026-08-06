import express, { Express } from "express";
import extractRouter from "./routes/extract.routes.js";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";

const app: Express = express();

app.use(express.json());

app.use("/api/v1/extract", extractRouter);

app.use(globalErrorHandler);

export default app;