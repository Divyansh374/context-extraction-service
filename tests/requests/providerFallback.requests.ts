import { TestCase } from "../types/testCase.type.js";

export const providerFallbackRequests: TestCase[] = [
    {
        id: "TC-PF-004",
        category: "provider-fallback",
        name: "Only Brave provider available",
        body: {
            topic: "Hospitals need better ways to reduce patient waiting times.",
            industry: "Healthcare",
        },
        expectedStatus: 200,
    },
];
