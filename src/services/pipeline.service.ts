import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.js";

interface CustomBody {
    topic: string;
    industry: string;
}

interface RequestData extends Request {
    body: CustomBody;
}

export const validateRequest = (req: RequestData, res: Response, next: NextFunction) => {
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
};

export const executePipeline = () => {};
