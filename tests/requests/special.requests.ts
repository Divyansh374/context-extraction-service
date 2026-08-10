import { TestCase } from "../types/testCase.type.js";

export const specialRequests: TestCase[] = [
    {
        id: "TC-SP-001",
        category: "special",
        name: "punctuation in topic",
        body: {
            topic: "How can small businesses improve cash flow?",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-002",
        category: "special",
        name: "hyphenated industry",
        body: {
            topic: "Businesses struggle with supply-chain disruptions and unpredictable demand",
            industry: "Supply-Chain Management",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-003",
        category: "special",
        name: "ampersand in industry",
        body: {
            topic: "Businesses need better accounting and financial planning",
            industry: "Accounting & Finance",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-004",
        category: "special",
        name: "parentheses in topic",
        body: {
            topic: "Small businesses need better cash-flow forecasting (especially during growth)",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-005",
        category: "special",
        name: "apostrophe in topic",
        body: {
            topic: "Businesses can't accurately predict customer payment behaviour",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-006",
        category: "special",
        name: "slash in industry",
        body: {
            topic: "Companies need better systems for managing financial operations",
            industry: "Banking/Finance",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-007",
        category: "special",
        name: "colon and comma in topic",
        body: {
            topic: "Cash flow problems: delayed payments, unpredictable revenue, and rising costs",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-008",
        category: "special",
        name: "numbers in topic and industry",
        body: {
            topic: "Small businesses need better financial planning in 2026",
            industry: "FinTech 2.0",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-009",
        category: "special",
        name: "symbols in topic",
        body: {
            topic: "How can businesses reduce costs by 10%+ without hurting growth?",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-SP-010",
        category: "special",
        name: "mixed punctuation and Unicode",
        body: {
            topic: "छोटे व्यवसायों की नकदी प्रवाह समस्या — समाधान क्या है?",
            industry: "वित्तीय सेवाएँ & FinTech",
        },
        expectedStatus: 200,
    },
];
