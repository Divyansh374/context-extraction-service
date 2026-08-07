export interface Comment {
    author: string;
    comment: string;
    engagement: number;
}

export interface ScrapedPost {
    id: string;
    platform: "reddit" | "x";
    subreddit?: string;
    title?: string;
    content: string;
    author: string;
    url: string;
    engagement: number;
    comments?: Comment[];
    createdAt: Date;
}

export interface RedditScraper {
    search(query: string): Promise<ScrapedPost[]>;
}
