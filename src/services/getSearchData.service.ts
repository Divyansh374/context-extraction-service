import { search } from "../services/search.service.js";
import { Keyword } from "../types/keyword.js";
import { SearchResult } from "../types/searchResult.js";

export const getSearchData = async (keywords: Keyword[], site: string) => {
    const query = `site:${site} (${keywords
        .slice(0, 3)
        .map((keyword) => `"${keyword.content}"`)
        .join(" OR ")})`;

    const searchData: SearchResult[] = await search(query);

    return searchData;
};
