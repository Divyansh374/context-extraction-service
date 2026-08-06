import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";
import nlp from "compromise";

interface CustomBody {
    topic: string;
    industry: string;
}

interface Term {
    text: string;
    tags: string[];
}

interface Token {
    terms: Term[];
}

interface PipelineInput {
    topic: string;
    industry: string;
    keywords: Term[];
}

type Empty = Record<string, never>;

export const validateRequest = (
    req: Request<Empty, Empty, CustomBody>,
    res: Response,
    next: NextFunction,
) => {
    if (!req.body) {
        return next(new AppError(401, "Enter a valid request"));
    }

    let { topic, industry } = req.body;

    if (topic.length <= 15 || topic.length >= 300) {
        return next(
            new AppError(
                401,
                "Topic should be atleast 15 characters and at most 300 characters long",
            ),
        );
    } else if (industry.length > 100) {
        return next(new AppError(401, "Industry should be at most 100 characters long"));
    }

    topic = topic.replace(/\s+/g, " ").trim().toLowerCase();
    industry = industry.replace(/\s+/g, " ").trim().toLowerCase();

    const doc = nlp(topic);
    const tokens = doc.json() as Token[];

    const keywords: Term[] = tokens
        .map((token: Token) => token.terms)
        .flat()
        .filter((term: Term) => term.tags.includes("Noun") || term.tags.includes("Adjective"));

    const pipelineInput: PipelineInput = {
        topic,
        industry,
        keywords,
    };

    req.pipelineInput = pipelineInput;
};

export const executePipeline = () => {};
