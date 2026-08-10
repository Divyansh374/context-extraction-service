import { TestCase } from "../types/testCase.type.js";

export const veryLongInputs: TestCase[] = [
    {
        id: "TC-VL-001",
        category: "very-long-inputs",
        name: "topic exactly at maximum length",
        body: {
            topic: "Businesses need to improve customer retention by understanding changing customer preferences, improving product quality, strengthening support services, reducing friction across customer journeys, identifying emerging dissatisfaction, responding to competitive alternatives, and developing strategies that create long-term customer value and loyalty.",
            industry: "Financial Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-VL-002",
        category: "very-long-inputs",
        name: "topic exceeds maximum length",
        body: {
            topic: "Businesses need to improve customer retention by understanding changing customer preferences, improving product quality, strengthening support services, reducing friction across customer journeys, identifying emerging dissatisfaction, responding to competitive alternatives, and developing strategies that create long-term customer value and loyalty while maintaining sustainable growth across increasingly competitive markets.",
            industry: "Financial Services",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-VL-003",
        category: "very-long-inputs",
        name: "industry exactly at maximum length",
        body: {
            topic: "Organizations need to improve operational efficiency and customer satisfaction.",
            industry: "Healthcare Technology and Digital Medical Services",
        },
        expectedStatus: 200,
    },
    {
        id: "TC-VL-004",
        category: "very-long-inputs",
        name: "industry exceeds maximum length",
        body: {
            topic: "Organizations need to improve operational efficiency and customer satisfaction.",
            industry: "Healthcare Technology and Digital Medical Services Organizations",
        },
        expectedStatus: 400,
    },
    {
        id: "TC-VL-005",
        category: "very-long-inputs",
        name: "both fields exceed maximum length",
        body: {
            topic: "Businesses need to improve customer retention by understanding changing customer preferences, improving product quality, strengthening support services, reducing friction across customer journeys, identifying emerging dissatisfaction, responding to competitive alternatives, and developing strategies that create long-term customer value and loyalty while maintaining sustainable growth across increasingly competitive markets.",
            industry: "Healthcare Technology and Digital Medical Services Organizations",
        },
        expectedStatus: 400,
    },
];
