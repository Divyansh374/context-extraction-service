import { LLM_SYSTEM_PROMPT } from "../constants/prompt.constant.js";
import { ContentItem } from "../types/contentItem.js";

export const createResearchPrompt = (
    topic: string,
    industry: string,
    content: ContentItem[],
): { systemPrompt: string; userPrompt: string } => {
    const userPrompt = `
    Startup Idea:
    ${topic}

    Industry:
    ${industry}

    COLLECTED CONTENT:
    
    ${content
        .map(
            (item) => `
    Platform: ${item.platform}
    ID: ${item.id}
    Title: ${item.title ?? "N/A"}
    Author: ${item.author ?? "N/A"}
    Subreddit: ${item.subreddit}
    Engagement: ${item.engagement ?? "N/A"}
    Content: ${item.content}
    URL: ${item.url}

    Comments:
    ${item.comments?.map((comment) => `- ${comment.comment}`).join("\n") ?? "N/A"}
        `,
        )
        .join("\n--------------------------\n")}
    `;

    return {
        systemPrompt: LLM_SYSTEM_PROMPT,
        userPrompt,
    };
};
