import { SearchProvider } from "../types/provider.js";
import { SearchResult } from "../types/searchResult.js";
import AppError from "../utils/AppError.js";

const apiKey = process.env.BRAVE_API_KEY;

if (!apiKey) {
    throw new AppError(500, "BRAVE_API_KEY is not configured");
}

class BraveProvider implements SearchProvider {
    async search(query: string): Promise<SearchResult[]> {
        let response;
        try {
            response = await fetch(
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
            );
        } catch {
            throw new AppError(500, "Brave request failed");
        }

        if (!response.ok) {
            throw new AppError(response.status, "Brave API request failed");
        }

        const data = await response.json();

        const searchResults: SearchResult[] = [];
        data.web.results.forEach((item) => {
            searchResults.push({
                title: item.title,
                url: item.url,
                snippet: item.description,
            });
        });

        return searchResults;
    }
}

export default new BraveProvider();
