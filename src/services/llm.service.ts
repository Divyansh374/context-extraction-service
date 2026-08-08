import { ContentItem } from "../types/contentItem.js";
import Groq from "groq-sdk";
import AppError from "../utils/AppError.js";
import { createResearchPrompt } from "./prompt.service.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const initializeLLM = async (topic: string, industry: string, content: ContentItem[]) => {
    const { systemPrompt, userPrompt } = createResearchPrompt(topic, industry, content);

    const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
            {
                role: "system",
                content: systemPrompt,
            },
            {
                role: "user",
                content: userPrompt,
            },
        ],

        temperature: 0.2,

        response_format: {
            type: "json_object",
        },
    });

    const resultContent = completion.choices[0].message.content!;

    try {
        return JSON.parse(resultContent);
    } catch {
        throw new AppError(500, "Invalid JSON returned by LLM");
    }
};
