import { TestCase } from "../types/testCase.type.js";

export const providerFallbackRequests: TestCase[] = [
    {
        id: "TC-PF-005",
        category: "provider-fallback",
        name: "Only Serper provider available",
        body: {
            topic: "Restaurants struggle to accurately predict daily demand, leading to food waste and stock shortages.",
            industry: "Hospitality",
        },
        expectedStatus: 200,
    },
];
