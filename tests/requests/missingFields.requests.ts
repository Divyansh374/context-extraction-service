import { TestCase } from "../types/testCase.type.js";

export const missingFieldsRequests: TestCase[] = [
    {
        id: "TC-MF-001",
        category: "missing-fields",
        name: "missing topic",
        body: {
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-MF-002",
        category: "missing-fields",
        name: "missing industry",
        body: {
            topic: "Hospitals need to reduce patient waiting times.",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-MF-003",
        category: "missing-fields",
        name: "missing topic and industry",
        body: {},
        expectedStatus: 400,
    },
    {
        id: "TC-MF-004",
        category: "missing-fields",
        name: "topic omitted with different industry",
        body: {
            industry: "Financial Services",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-MF-005",
        category: "missing-fields",
        name: "industry omitted with different topic",
        body: {
            topic: "Online retailers need to reduce cart abandonment.",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-MF-006",
        category: "missing-fields",
        name: "topic omitted with manufacturing industry",
        body: {
            industry: "Manufacturing",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-MF-007",
        category: "missing-fields",
        name: "industry omitted with education topic",
        body: {
            topic: "Universities need better ways to identify students at risk.",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-MF-008",
        category: "missing-fields",
        name: "topic omitted with hospitality industry",
        body: {
            industry: "Hospitality",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-MF-009",
        category: "missing-fields",
        name: "industry omitted with technology topic",
        body: {
            topic: "Software companies struggle to maintain reliable deployments.",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-MF-010",
        category: "missing-fields",
        name: "only unrelated field provided",
        body: {
            foo: "bar",
        },
        expectedStatus: 400,
    },
];
