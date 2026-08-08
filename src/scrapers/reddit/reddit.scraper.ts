import { getSearchLimit, MINIMUM_UPVOTES } from "../../constants/pipeline.constants.js";
import { Keyword } from "../../types/keyword.js";
import { getComments } from "../../services/redditComment.service.js";
import { ContentItem } from "../../types/contentItem.js";

const getPosts = async (keyword: Keyword) => {
    const query = keyword.content.split(" ");
    const response = await fetch(
        `https://api.pullpush.io/reddit/search/submission?q=${query.join("+")}&size=10&sort=desc&sort_type=score`,
    );
    const data = await response.json();

    const result = new Map<string, ContentItem>();

    data.data.forEach((item) => {
        result.set(item.id, {
            id: item.id,
            platform: "reddit",
            subreddit: item.subreddit,
            title: item.title,
            content: item.selftext,
            author: item.author,
            url: `https://reddit.com/${item.permalink}`,
            engagement: item.score,
            createdAt: new Date(),
        });
    });

    return [...result.values()];
};

export const redditScraper = async (keywords: Keyword[]) => {
    const search_cap = getSearchLimit(keywords);

    const promises = keywords.slice(0, search_cap).map((keyword) => getPosts(keyword));
    const results = await Promise.all(promises);

    const sortedResults = results
        .flat()
        .filter(
            (post): post is ContentItem =>
                post.engagement !== undefined && post.engagement >= MINIMUM_UPVOTES,
        )
        .sort((a, b) => b.engagement! - a.engagement!)
        .slice(0, 20);

    await Promise.allSettled(
        sortedResults.map(async (post) => {
            try {
                post.comments = await getComments(post.id);
            } catch {
                post.comments = [];
            }
        }),
    );

    return sortedResults;
};
