import { type Request, type Response } from "express";
import { executePipeline } from "../services/pipeline.service.js";

export const extractContent = async (
    req: Request,
    res: Response
): Promise<void> => {
    const result = await executePipeline();

    res.status(200).json(result);
}