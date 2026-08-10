import { ContentItem } from "../../src/types/contentItem.js";

export interface Result {
    topic: string;
    industry: string;
    sources: {
        reddit: "success" | "failed";
        linkedIn: "success" | "failed";
        instagram: "success" | "failed";
    };
    report: {
        signals: ContentItem[];
    };
}
