import { getProviders } from "../providers/providers.js";
import { SearchResult } from "../types/searchResult.js";

export const search = async (query: string) => {
    const providers = getProviders();
    for (const provider of providers) {
        try {
            const results: SearchResult[] = await provider.search(query);

            if (results.length > 0) {
                return results;
            }
        } catch {
            continue;
        }
    }

    return [];
};
