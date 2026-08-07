import { Keyword } from "../types/keyword.js";

export const MAX_POSTS = 20;
export const MAX_COMMENTS = 3;
export const MINIMUM_UPVOTES = 5;
export const getSearchLimit = (keywords: Keyword[]): number => {
    return Math.min(Math.ceil(keywords.length / 3), 5);
};
