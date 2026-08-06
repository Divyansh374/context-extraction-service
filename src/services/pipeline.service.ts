import { Request, Response, NextFunction } from "express";
import { extractKeywords } from "./nlp.service.js";

export interface PipelineInput {
    topic: string;
    industry: string;
    keywords: string[];
}

export const getKeywords = (req: Request, res: Response, next: NextFunction) => {
    let { topic, industry } = req.body;

    topic = topic.replace(/\s+/g, " ").trim().toLowerCase();
    industry = industry.replace(/\s+/g, " ").trim().toLowerCase();

    const keywords = extractKeywords(topic);

    const pipelineInput: PipelineInput = {
        topic,
        industry,
        keywords,
    };

    req.pipelineInput = pipelineInput;

    next();
};

export const executePipeline = (req: Request) => {
    return req.pipelineInput;
};
