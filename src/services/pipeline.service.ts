import { Request, Response, NextFunction } from "express";
import { extractKeywords } from "./nlp.service.js";
import { Keyword } from "../types/keyword.js";
import { redditScraper } from "../scrapers/reddit/reddit.scraper.js";
import { initializeLLM } from "./llm.service.js";
import { ContentItem } from "../types/contentItem.js";
import AppError from "../utils/AppError.js";
import { linkedInScraper } from "../scrapers/linkedIn/linkedIn.scraper.js";
import { instagramScraper } from "../scrapers/instagram/instagram.scraper.js";

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
    const results = await Promise.allSettled([
        redditScraper(keywords),
        linkedInScraper(keywords),
        instagramScraper(keywords),
    ]);

    if (!results) {
        throw new AppError(500, "Something went wrong");
    }

    const content: ContentItem[] = results.flatMap((result): ContentItem[] =>
        result.status === "fulfilled" ? result.value : [],
    );

    if (!content || content.length === 0) {
        throw new AppError(500, "Something went wrong");
    }

    const report: JSON = await initializeLLM(topic, industry, content);

    return report;
};
