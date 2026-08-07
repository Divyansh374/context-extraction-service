import { NextFunction } from "express";
import { MAX_SEARCHES } from "../constants/pipeline.constants.js";
import { Keyword } from "../types/keyword.js";
import AppError from "../utils/AppError.js";
import { ScrapedPost } from "../types/scrapedPost.js";

export const searchReddit = async (
    req: Request,
    res: Response,
    next: NextFunction,
    keywords: Keyword[],
) => {
    const search_cap = MAX_SEARCHES(keywords);

    for (let i: number = 0; i < search_cap; i++) {
        let response, data;

        try {
            const query = keywords[i].content.split(" ");
            response = await fetch(
                `https://api.pullpush.io/reddit/search/submission?q=${query.join("+")}&size=10&sort=desc&sort_type=score`,
            );
            data = await response.json();
        } catch {
            return next(new AppError(502, "The requested server is not working"));
        }

        const result = new Set<ScrapedPost>();

        data.data.forEach((item) => {
            result.add({
                id: item.id,
                platform: "reddit",
                subreddit: item.subreddit,
                title: item.title,
                content: item.selftext,
                author: item.author,
                url: `https://reddit.com/${item.permalink}`,
                engagement: item.score,
                createdAt: new Date(),
            });
        });
    }
};
