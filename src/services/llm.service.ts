import Groq from "groq-sdk";
import { ScrapedPost } from "../types/scrapedPost.js";
import AppError from "../utils/AppError.js";

console.log(process.env.GROQ_API_KEY);
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const initializeLLM = async (topic: string, industry: string, posts: ScrapedPost[]) => {
    const prompt = `
    You are an expert startup market researcher

    You will receive:

    1. The startup idea.
    2. The industry.
    3. Reddit discussions.

    Your job is to:

    1. Ignore Reddit posts that are not relevant.
    2. Use ONLY relevant posts.
    3. Identify common pain points.
    4. Identify existing solutions.
    5. Suggest features for this startup.
    6. Identify positive and negative sentiment of the post.
    7. Give an overall conclusion.

    A Reddit post is relevant if it discusses:

    - the same user problem
    - frustrations related to the Startup Idea or Industry
    - existing workflows
    - feature requests
    - customer experiences

    Ignore posts that only contain losely related keywords.

    all derived from the posts.

    Be objective.

    Do not exaggerate.

    If the reddit discussions do not support a claim, explicitly state that there is insufficient evidence.

    Posts with higher engagement generally represent stronger community opinions.

    Consider engagement while drawing conclusions, but do not ignore posts with lower engagement if they have valuable information.

    Generate the report using exactly these sections:

    - Market Validation
    - Pain Points
    - Existing Solutions
    - Feature Suggestions
    - Community Sentiment
    - Risks
    - Final Verdict

    Return your answer in JSON like this:

    {
        "marketValidation": "...",
        "painPoints": [
          "...",
          "..."
        ],
        "existingSolutions": [
          "...",
          "..."
        ],
        "featureSuggestions": [
          "...",
          "..."
        ],
        "communitySentiment": "...",
        "risks": [
          "...",
          "..."
        ],
        "finalVerdict": "..."
    }

    ---------------------------------

    Startup Idea:
    ${topic}

    Industry:
    ${industry}

    ---------------------------------

    Reddit Discussions:

    ${posts
        .map(
            (post) => `
    ID:
    ${post.id}

    Title:
    ${post.title}

    Engagement:
    ${post.engagement}
    
    Content:
    ${post.content}

    Top Comments:

    ${post.comments?.map((comment) => `- ${comment.comment}`).join("\n")}      
    `,
        )
        .join("\n----------------------\n")}
    `;

    const completion = groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        messages: [
            {
                role: "system",
                content:
                    "You are an experienced startup market researcher. Always follow the user's instructions exactly and return valid JSON only.",
            },
            {
                role: "user",
                content: prompt,
            },
        ],

        temperature: 0.2,

        response_format: {
            type: "json_object",
        },
    });

    const content = (await completion).choices[0].message.content!;

    try {
        return JSON.parse(content);
    } catch {
        throw new AppError(500, "Invalid JSON returned by LLM");
    }
};
