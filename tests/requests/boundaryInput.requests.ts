import { TestCase } from "../types/testCase.type.js";

export const boundaryInputRequests: TestCase[] = [
    {
        id: "TC-BL-001",
        category: "boundary-input",
        name: "topic exactly 300 characters",
        body: {
            topic: "A".repeat(300),
            industry: "Healthcare",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-BL-002",
        category: "boundary-input",
        name: "topic exceeds maximum by 1 character",
        body: {
            topic: "A".repeat(301),
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-BL-003",
        category: "boundary-input",
        name: "industry exactly 100 characters",
        body: {
            topic: "Healthcare technology",
            industry: "A".repeat(100),
        },
        expectedStatus: 200,
    },
    {
        id: "TC-BL-004",
        category: "boundary-input",
        name: "industry exceeds maximum by 1 character",
        body: {
            topic: "Healthcare technology",
            industry: "A".repeat(101),
        },
        expectedStatus: 400,
    },
    {
        id: "TC-BL-005",
        category: "boundary-input",
        name: "topic exactly 299 characters",
        body: {
            topic: "A".repeat(299),
            industry: "Healthcare",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-BL-006",
        category: "boundary-input",
        name: "industry exactly 99 characters",
        body: {
            topic: "Healthcare technology",
            industry: "A".repeat(99),
        },
        expectedStatus: 200,
    },
    {
        id: "TC-BL-007",
        category: "boundary-input",
        name: "topic 300 and industry 100 characters",
        body: {
            topic: "A".repeat(300),
            industry: "A".repeat(100),
        },
        expectedStatus: 200,
    },
    {
        id: "TC-BL-008",
        category: "boundary-input",
        name: "topic 301 and industry 100 characters",
        body: {
            topic: "A".repeat(301),
            industry: "A".repeat(100),
        },
        expectedStatus: 400,
    },
    {
        id: "TC-BL-009",
        category: "boundary-input",
        name: "topic 300 and industry 101 characters",
        body: {
            topic: "A".repeat(300),
            industry: "A".repeat(101),
        },
        expectedStatus: 400,
    },
    {
        id: "TC-BL-010",
        category: "boundary-input",
        name: "topic 301 and industry 101 characters",
        body: {
            topic: "A".repeat(301),
            industry: "A".repeat(101),
        },
        expectedStatus: 400,
    },
];
