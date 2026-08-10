import { TestCase } from "../types/testCase.type.js";

export const invalidDataTypeRequests: TestCase[] = [
    {
        id: "TC-IDT-001",
        category: "invalid-data-types",
        name: "topic as number",
        body: {
            topic: 12345,
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-002",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: "Hospitals need to reduce patient waiting times.",
            industry: 12345,
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-003",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: 43538,
            industry: 12345,
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-004",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: true,
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-005",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: "Hospitals need to reduce patient waiting times.",
            industry: false,
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-006",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: ["Healthcare", "hospitals"],
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-007",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: "Hospitals need to reduce patient waiting times.",
            industry: ["Healthcare"],
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-008",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: { text: "Hospitals need to reduce patient waiting times." },
            industry: "Healthcare",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-009",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: "Hospitals need to reduce patient waiting times.",
            industry: { name: "Healthcare" },
        },
        expectedStatus: 400,
    },
    {
        id: "TC-IDT-010",
        category: "invalid-data-types",
        name: "industry as number",
        body: {
            topic: { text: "Hospitals need to reduce patient waiting times." },
            industry: { name: "Healthcare" },
        },
        expectedStatus: 400,
    },
];
