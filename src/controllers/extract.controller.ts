import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

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
        return next(new AppError(401, "Enter a valid request"));
    }

    const { topic, industry } = req.body;

    if (topic.length <= 15 || topic.length >= 300) {
        return next(
            new AppError(
                401,
                "Topic should be atleast 15 characters and at most 300 characters long",
            ),
        );
    }

    if (industry.length > 100) {
        return next(new AppError(401, "Industry should be at most 100 characters long"));
    }

    next();
};

export const extractContent = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json(req.pipelineInput);
};
