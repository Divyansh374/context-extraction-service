import { tavily } from "@tavily/core";
import { SearchProvider } from "../types/provider.js";
import { SearchResult } from "../types/searchResult.js";

const tavilyClient = tavily({
    apiKey: process.env.TAVILY_API_KEY,
});

class TavilyProvider implements SearchProvider {
    async search(query: string): Promise<SearchResult[]> {
        const response = await tavilyClient.search(query);

        const searchResult: SearchResult[] = [];

        response.results.forEach((item) => {
            searchResult.push({
                title: item.title,
                url: item.url,
                snippet: item.content,
            });
        });

        return searchResult;
    }
}

export default new TavilyProvider();
