import { Keyword } from "../types/keyword.js";

export const MAX_POSTS = 10;
export const MAX_COMMENTS = 3;
export const MAX_COMMENT_LENGTH = 500;
export const MAX_CONTENT_LENGTH = 1500;
export const MINIMUM_UPVOTES = 5;
export const PROVIDER_TIMEOUT_MS = 10_000;
export const getSearchLimit = (keywords: Keyword[]): number => {
    return Math.min(Math.ceil(keywords.length / 3), 5);
};
