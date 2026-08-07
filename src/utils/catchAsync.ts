import { Request, Response, NextFunction } from "express";

type AsyncController = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const catchAsync = (fn: AsyncController) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
};

export default catchAsync;
