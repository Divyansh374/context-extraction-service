import { Request, Response, NextFunction } from "express";
import nlp from "compromise";

interface Term {
    text: string;
    tags: string[];
    normal: string;
}

interface Token {
    terms: Term[];
}

export interface PipelineInput {
    topic: string;
    industry: string;
    keywords: string[];
}

export const extractKeywords = (req: Request, res: Response, next: NextFunction) => {
    let { topic, industry } = req.body;

    const stopWords = new Set([
        "near",
        "many",
        "much",
        "very",
        "really",
        "quite",
        "just",
        "also",
        "often",
        "always",
        "never",
        "today",
        "tomorrow",
    ]);

    topic = topic.replace(/\s+/g, " ").trim().toLowerCase();
    industry = industry.replace(/\s+/g, " ").trim().toLowerCase();

    const doc = nlp(topic);
    const tokens = doc.json() as Token[];

    tokens
        .flatMap((token) => token.terms)
        .forEach((term) => {
            console.log(term.normal, term.tags);
        });

    const filteredData: Term[] = tokens
        .map((token: Token) => token.terms)
        .flat()
        .filter(
            (term: Term) =>
                term.tags.includes("Noun") &&
                !term.tags.includes("Pronoun") &&
                !stopWords.has(term.normal),
        );

    const keywords = [...new Set(filteredData.map((term) => term.normal))];

    const pipelineInput: PipelineInput = {
        topic,
        industry,
        keywords,
    };

    req.pipelineInput = pipelineInput;

    next();
};

export const executePipeline = () => {};
