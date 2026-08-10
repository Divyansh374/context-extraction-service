import { TestCase } from "../types/testCase.type.js";

export const whitespacesRequests: TestCase[] = [
    {
        id: "TC-WN-001",
        category: "whitespaces",
        name: "leading whitespace in topic",
        body: {
            topic: "   Small businesses struggle with unpredictable cash flow",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-WN-002",
        category: "whitespaces",
        name: "trailing whitespace in topic",
        body: {
            topic: "Small businesses struggle with unpredictable cash flow   ",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-WN-003",
        category: "whitespaces",
        name: "leading and trailing whitespace in both fields",
        body: {
            topic: "   Small businesses struggle with unpredictable cash flow   ",
            industry: "   Financial Services   ",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-WN-004",
        category: "whitespaces",
        name: "multiple spaces between words",
        body: {
            topic: "Small  businesses  struggle  with  unpredictable  cash  flow",
            industry: "Financial  Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-WN-005",
        category: "whitespaces",
        name: "tab whitespace around topic",
        body: {
            topic: "\tSmall businesses struggle with unpredictable cash flow\t",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-WN-006",
        category: "whitespaces",
        name: "newline whitespace around industry",
        body: {
            topic: "Small businesses struggle with unpredictable cash flow",
            industry: "\nFinancial Services\n",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-WN-007",
        category: "whitespaces",
        name: "mixed whitespace around both fields",
        body: {
            topic: " \t Small businesses struggle with unpredictable cash flow \n ",
            industry: "\n\t Financial Services \t",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-WN-008",
        category: "whitespaces",
        name: "topic becomes empty after trimming",
        body: {
            topic: "                              ",
            industry: "Financial Services",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-WN-009",
        category: "whitespaces",
        name: "industry becomes empty after trimming",
        body: {
            topic: "Small businesses struggle with unpredictable cash flow",
            industry: "                              ",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-WN-010",
        category: "whitespaces",
        name: "whitespace-only topic and industry",
        body: {
            topic: "                              ",
            industry: "                              ",
        },
        expectedStatus: 400,
    },
];
