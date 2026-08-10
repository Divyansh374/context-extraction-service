import { TestCase } from "../types/testCase.type.js";

export const emptyFieldsRequests: TestCase[] = [
    {
        id: "TC-EF-001",
        category: "empty-fields",
        name: "empty topic",
        body: {
            topic: "",
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-002",
        category: "empty-fields",
        name: "empty industry",
        body: {
            topic: "Hospitals need to reduce patient waiting times.",
            industry: "",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-003",
        category: "empty-fields",
        name: "both fields empty",
        body: {
            topic: "",
            industry: "",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-004",
        category: "empty-fields",
        name: "whitespace-only topic",
        body: {
            topic: "   ",
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-005",
        category: "empty-fields",
        name: "whitespace-only industry",
        body: {
            topic: "Hospitals need better emergency department management.",
            industry: "   ",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-006",
        category: "empty-fields",
        name: "newline-only topic",
        body: {
            topic: "\n\n",
            industry: "Education",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-007",
        category: "empty-fields",
        name: "tab-only industry",
        body: {
            topic: "Universities need better student retention strategies.",
            industry: "\t\t",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-008",
        category: "empty-fields",
        name: "empty topic with valid industry",
        body: {
            topic: "",
            industry: "Financial Services",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-009",
        category: "empty-fields",
        name: "valid topic with empty industry",
        body: {
            topic: "Manufacturers need to reduce equipment downtime.",
            industry: "",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-EF-010",
        category: "empty-fields",
        name: "empty strings with extra field",
        body: {
            topic: "",
            industry: "",
            extra: "ignored",
        },
        expectedStatus: 400,
    },
];
