import { NextFunction } from "express";
import { getSearchLimit } from "../constants/pipeline.constants.js";
import { Keyword } from "../types/keyword.js";
import { ScrapedPost } from "../types/scrapedPost.js";
import AppError from "../utils/AppError.js";

const getPosts = async (keyword: Keyword, next: NextFunction) => {
    let response, data;

    try {
        const query = keyword.content.split(" ");
        response = await fetch(
            `https://api.pullpush.io/reddit/search/submission?q=${query.join("+")}&size=10&sort=desc&sort_type=score`,
        );
        data = await response.json();
    } catch {
        return next(new AppError(502, "The requested server is not working"));
    }

    const result = new Map<string, ScrapedPost>();

    data.data.forEach((item) => {
        result.set(item.id, {
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

    return [...result.values()];
};

export const compilePosts = async (
    req: Request,
    res: Response,
    next: NextFunction,
    keywords: Keyword[],
) => {
    const search_cap = getSearchLimit(keywords);

    const promises = keywords.slice(0, search_cap).map((keyword) => getPosts(keyword, next));
    const results = await Promise.all(promises);

    const sortedResults = results
        .flat()
        .filter((post): post is ScrapedPost => !!post)
        .sort((a, b) => b.engagement - a.engagement)
        .slice(20);

    return sortedResults;
};
