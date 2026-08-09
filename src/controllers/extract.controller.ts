import { Request, Response, NextFunction } from "express";
import { executePipeline } from "../services/pipeline.service.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

interface CustomBody {
    topic: string;
    industry: string;
}

type Empty = Record<string, never>;

export const validateRequest = (
    req: Request<Empty, Empty, CustomBody>,
    res: Response,
    next: NextFunction,
) => {
    if (!req.body) {
        return next(new AppError(400, "Enter a valid request"));
    }

    const { topic, industry } = req.body;

    if (!topic || !industry) {
        return next(new AppError(400, "Specify both topic and industry"));
    }

    if (typeof topic !== "string" || typeof industry !== "string") {
        return next(new AppError(400, "Topic and industry fields should have strings as input"));
    }

    if (topic.length < 15 || topic.length > 300) {
        return next(
            new AppError(
                401,
                "Topic should be atleast 15 characters and at most 300 characters long",
            ),
        );
    }

    if (industry.length > 100) {
        return next(new AppError(400, "Industry should be at most 100 characters long"));
    }

    next();
};

export const extractContent = catchAsync(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { topic, industry, keywords } = req.pipelineInput!;
        let response;
        try {
            response = await executePipeline(topic, industry, keywords);
        } catch {
            res.status(200).json({
                topic,
                industry,
                report: {
                    signals: [],
                    message: "No relevant content found from any source",
                },
            });
        }

        if (!response) {
            return next(new AppError(500, "Internal sever error"));
        }

        res.status(200).json({
            topic,
            industry,
            sources: response.sources,
            report: response.report,
        });
    },
);
