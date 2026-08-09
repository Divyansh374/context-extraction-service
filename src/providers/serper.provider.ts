import { createHash } from "node:crypto";
import { SearchProvider } from "../types/provider.js";
import { SearchResult } from "../types/searchResult.js";
import { fetchWithTimeout } from "../utils/fetchWithTimeout.js";
import { PROVIDER_TIMEOUT_MS } from "../constants/pipeline.constants.js";
import AppError from "../utils/AppError.js";

const apiKey = process.env.SERPER_API_KEY;

if (!apiKey) {
    throw new AppError(500, "BRAVE_API_KEY is not configured");
}

class SerperProvider implements SearchProvider {
    async search(query: string): Promise<SearchResult[]> {
        let response;

        try {
            response = await fetchWithTimeout(
                "https://google.serper.dev/search",
                {
                    method: "POST",
                    headers: {
                        "X-API-KEY": apiKey!,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        q: query,
                    }),
                },
                PROVIDER_TIMEOUT_MS,
            );
        } catch {
            throw new AppError(500, "Serper request failed");
        }

        if (!response.ok) {
            throw new AppError(response.status, "Serper API request failed");
        }

        const data = await response.json();

        const searchResults: SearchResult[] = [];
        data.organic.forEach((item) => {
            searchResults.push({
                id: item.id ?? createHash(item.url),
                title: item.title,
                url: item.link,
                snippet: item.snippet,
            });
        });

        return searchResults;
    }
}

export default new SerperProvider();
