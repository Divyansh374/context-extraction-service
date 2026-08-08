import { getSearchData } from "../../services/getSearchData.service.js";
import { ContentItem } from "../../types/contentItem.js";
import { Keyword } from "../../types/keyword.js";
import { SearchResult } from "../../types/searchResult.js";

export const linkedInScraper = async (keywords: Keyword[]) => {
    const data: SearchResult[] = await getSearchData(keywords, "linkedin.com");

    const result: ContentItem[] = [];

    data.forEach((item) => {
        result.push({
            id: item.id,
            platform: "linkedIn",
            title: item.title,
            url: item.url,
            content: item.snippet,
        });
    });

    return result;
};
