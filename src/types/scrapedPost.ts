export interface ScrapedPost {
    platform: "reddit" | "x";
    subreddit?: string;
    title?: string;
    content: string;
    author: string;
    url: string;
    engagement: number;
    comments: {
        author: string;
        comment: string;
    }[];
    createdAt: Date;
}
