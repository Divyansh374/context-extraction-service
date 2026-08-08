import { Keyword } from "../../types/keyword.js";

export const getSearchData = (keywords: Keyword[]) => {
    const painPoints = keywords.map((item) => `"${item.content}"`);
    const painPointStr = painPoints.join(" ");

    const query = `site:linkedin.com ${painPointStr}`;

    return query;
};
