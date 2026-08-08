import { getSearchData } from "../../services/getSearchData.service.js";
import { ContentItem } from "../../types/contentItem.js";
import { Keyword } from "../../types/keyword.js";
import { SearchResult } from "../../types/searchResult.js";

export const instagramScraper = async (keywords: Keyword[]) => {
    const data: SearchResult[] = await getSearchData(keywords, "instagram.com");

    const result: ContentItem[] = [];

    data.forEach((item) => {
        result.push({
            id: item.id,
            platform: "instagram",
            title: item.title,
            url: item.url,
            content: item.snippet,
        });
    });

    return result;
};
