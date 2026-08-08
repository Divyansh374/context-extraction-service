import { tavily } from "@tavily/core";
import { SearchProvider } from "../types/provider.js";
import { SearchResult } from "../types/searchResult.js";
import AppError from "../utils/AppError.js";

const apiKey = process.env.TAVILY_API_KEY;

if (!apiKey) {
    throw new AppError(500, "TAVILY_API_KEY is not configured");
}

const tavilyClient = tavily({
    apiKey,
});

class TavilyProvider implements SearchProvider {
    async search(query: string): Promise<SearchResult[]> {
        const response = await tavilyClient.search(query);

        const searchResult: SearchResult[] = [];

        response.results.forEach((item) => {
            searchResult.push({
                id: item.id,
                title: item.title,
                url: item.url,
                snippet: item.content,
            });
        });

        return searchResult;
    }
}

export default new TavilyProvider();
