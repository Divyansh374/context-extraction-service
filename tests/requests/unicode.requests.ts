import { TestCase } from "../types/testCase.type.js";

export const unicodeRequests: TestCase[] = [
    {
        id: "TC-UC-001",
        category: "unicode-input",
        name: "Hindi Unicode input",
        body: {
            topic: "भारतीय छोटे व्यवसायों में नकदी प्रवाह की समस्या",
            industry: "वित्तीय सेवाएं",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-UC-002",
        category: "unicode-input",
        name: "Emoji Unicode input",
        body: {
            topic: "Small businesses struggle with unpredictable cash flow 💰",
            industry: "Financial Services 🚀",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-UC-003",
        category: "unicode-input",
        name: "Lone high surrogate in topic",
        body: {
            topic: "Small businesses struggle with cash flow \uD83D problems",
            industry: "Financial Services",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-UC-004",
        category: "unicode-input",
        name: "Lone low surrogate in industry",
        body: {
            topic: "Small businesses struggle with unpredictable cash flow",
            industry: "Financial Services \uDE00",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-UC-005",
        category: "unicode-input",
        name: "Mismatched surrogate pair",
        body: {
            topic: "Small businesses struggle with cash flow \uD83D\u0041 problems",
            industry: "Financial Services",
        },
        expectedStatus: 400,
    },
];
