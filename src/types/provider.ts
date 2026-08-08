import { SearchResult } from "./searchResult.js";

export interface SearchProvider {
    search(query: string): Promise<SearchResult[]>;
}
