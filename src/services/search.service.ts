import { getProviders } from "../providers/providers.js";

export const search = async (query: string) => {
    const providers = getProviders();
    for (const provider of providers) {
        const results = await provider.search(query);

        if (results.length > 0) {
            return results;
        }
    }

    return [];
};
