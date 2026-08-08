import { Request, Response, NextFunction } from "express";
import { extractKeywords } from "./nlp.service.js";
import { Keyword } from "../types/keyword.js";
import { redditScraper } from "../scrapers/reddit/reddit.scraper.js";
import AppError from "../utils/AppError.js";
import { ScrapedPost } from "../types/scrapedPost.js";
import { initializeLLM } from "./llm.service.js";

export interface PipelineInput {
    topic: string;
    industry: string;
    keywords: Keyword[];
}

export const getKeywords = (req: Request, res: Response, next: NextFunction) => {
    let { topic, industry } = req.body;

    topic = topic.replace(/\s+/g, " ").trim().toLowerCase();
    industry = industry.replace(/\s+/g, " ").trim().toLowerCase();

    const keywords = extractKeywords(topic);

    if (!keywords) {
        return next(new AppError(400, "Internal error"));
    }

    const pipelineInput: PipelineInput = {
        topic,
        industry,
        keywords,
    };

    req.pipelineInput = pipelineInput;

    next();
};

export const executePipeline = async (topic: string, industry: string, keywords: Keyword[]) => {
    const redditPosts: ScrapedPost[] = await redditScraper(keywords);

    const report: JSON = await initializeLLM(topic, industry, redditPosts);

    return report;
};
