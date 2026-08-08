import { Keyword } from "../../types/keyword.js";

export const getSearchData = (keywords: Keyword[]) => {
    const query = `site:linkedin.com ${keywords
        .slice(3)
        .map((keyword) => `"${keyword.content}"`)
        .join(" ")}`;

    return query;
};
