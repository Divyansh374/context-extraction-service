import { Request, Response, NextFunction } from "express";
import { extractKeywords } from "./nlp.service.js";
import { Keyword } from "../types/keyword.js";
import { redditScraper } from "../scrapers/reddit/reddit.scraper.js";
import { initializeLLM } from "./llm.service.js";
import { ContentItem } from "../types/contentItem.js";
import { linkedInScraper } from "../scrapers/linkedIn/linkedIn.scraper.js";
import { instagramScraper } from "../scrapers/instagram/instagram.scraper.js";
import AppError from "../utils/AppError.js";

export interface PipelineInput {
    topic: string;
    industry: string;
    keywords: Keyword[];
}

interface Sources {
    reddit: "success" | "failed";
    instagram: "success" | "failed";
    linkedIn: "success" | "failed";
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

    const sources: Sources = {
        reddit: "failed",
        linkedIn: "failed",
        instagram: "failed",
    };

    const content: ContentItem[] = results.flatMap((result, i): ContentItem[] => {
        const platforms: (keyof Sources)[] = ["reddit", "linkedIn", "instagram"];
        const currentPlatform = platforms[i];

        if (result.status === "fulfilled") {
            sources[currentPlatform] = "success";
            return result.value;
        } else {
            return [];
        }
    });

    if (!content || content.length === 0) {
        throw new Error();
    }

    const report: JSON = await initializeLLM(topic, industry, content);

    return {
        sources,
        report,
    };
};
