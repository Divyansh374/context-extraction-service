import { TestCase } from "../types/testCase.type.js";

export const providerFallbackRequests: TestCase[] = [
    {
        id: "TC-PF-001",
        category: "provider-fallback",
        name: "All search providers unavailable",
        body: {
            topic: "Hospitals need better ways to reduce patient waiting times.",
            industry: "Healthcare",
        },
        expectedStatus: 200,
    },
];
