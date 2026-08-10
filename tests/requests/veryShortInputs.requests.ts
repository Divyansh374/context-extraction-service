import { TestCase } from "../types/testCase.type.js";

export const VeryShortInputs: TestCase[] = [
    {
        id: "TC-VS-001",
        category: "very-short-inputs",
        name: "single-character topic",
        body: {
            topic: "a",
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-VS-002",
        category: "very-short-inputs",
        name: "single-character industry",
        body: {
            topic: "Hospitals need better emergency response systems.",
            industry: "a",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-VS-003",
        category: "very-short-inputs",
        name: "two-character topic",
        body: {
            topic: "AI",
            industry: "Technology",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-VS-004",
        category: "very-short-inputs",
        name: "short but valid industry abbreviation",
        body: {
            topic: "Businesses need better customer retention strategies.",
            industry: "IT",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-VS-005",
        category: "very-short-inputs",
        name: "both inputs extremely short",
        body: {
            topic: "Hi",
            industry: "IT",
        },
        expectedStatus: 400,
    },
];
