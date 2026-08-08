export interface Comment {
    author: string;
    comment: string;
    engagement: number;
}

export interface ContentItem {
    id: string;
    platform: "reddit" | "linkedIn" | "instagram" | "web";
    title: string;
    content: string;
    url: string;
    author?: string;
    subreddit?: string;
    engagement?: number;
    comments?: Comment[];
    createdAt?: Date;
}
