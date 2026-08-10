import { tavily } from "@tavily/core";
import { SearchProvider } from "../types/provider.js";
import { SearchResult } from "../types/searchResult.js";
import { createHash } from "node:crypto";
import { PROVIDER_TIMEOUT_MS } from "../constants/pipeline.constants.js";
import AppError from "../utils/appError.js";

const apiKey = process.env.TAVILY_API_KEY;

if (!apiKey) {
    throw new AppError(500, "TAVILY_API_KEY is not configured");
}

const tavilyClient = tavily({
    apiKey,
});

class TavilyProvider implements SearchProvider {
    async search(query: string): Promise<SearchResult[]> {
        const response = await tavilyClient.search(query, {
            timeout: PROVIDER_TIMEOUT_MS / 1000,
        });
        console.log("[Tavily] Searching...");

        const searchResult: SearchResult[] = [];

        response.results.forEach((item) => {
            searchResult.push({
                id: item.id ?? createHash(item.url),
                title: item.title,
                url: item.url,
                snippet: item.content,
            });
        });

        return searchResult;
    }
}

export default new TavilyProvider();
