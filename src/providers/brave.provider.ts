import { createHash } from "node:crypto";
import { SearchProvider } from "../types/provider.js";
import { SearchResult } from "../types/searchResult.js";
import { fetchWithTimeout } from "../utils/fetchWithTimeout.js";
import { PROVIDER_TIMEOUT_MS } from "../constants/pipeline.constants.js";
import AppError from "../utils/appError.js";

interface BraveResult {
    id?: string;
    title: string;
    url: string;
    description: string;
}

const apiKey = process.env.BRAVE_API_KEY;

class BraveProvider implements SearchProvider {
    async search(query: string): Promise<SearchResult[]> {
        if (!apiKey) {
            throw new AppError(500, "BRAVE_API_KEY is not configured");
        }
        let response;
        try {
            response = await fetchWithTimeout(
                `https://api.search.brave.com/res/v1/web/search?${new URLSearchParams({
                    q: query,
                    count: "10",
                    country: "IN",
                    search_lang: "en",
                })}`,
                {
                    headers: {
                        "X-Subscription-Token": apiKey!,
                        Accept: "application/json",
                    },
                },
                PROVIDER_TIMEOUT_MS,
            );
        } catch {
            throw new AppError(500, "Brave request failed");
        }

        if (!response.ok) {
            throw new AppError(response.status, "Brave API request failed");
        }

        const data = await response.json();

        const searchResults: SearchResult[] = [];
        data.web?.results?.forEach((item: BraveResult) => {
            searchResults.push({
                id: item.id ?? createHash("sha256").update(item.url).digest("hex"),
                title: item.title,
                url: item.url,
                snippet: item.description ?? "",
            });
        });

        return searchResults;
    }
}

export default new BraveProvider();
