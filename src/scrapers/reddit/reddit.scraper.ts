import { getSearchLimit, MINIMUM_UPVOTES } from "../../constants/pipeline.constants.js";
import { Keyword } from "../../types/keyword.js";
import AppError from "../../utils/AppError.js";
import { getComments } from "../../services/redditComment.service.js";
import { ContentItem } from "../../types/contentItem.js";

const getPosts = async (keyword: Keyword) => {
    let response, data;

    try {
        const query = keyword.content.split(" ");
        response = await fetch(
            `https://api.pullpush.io/reddit/search/submission?q=${query.join("+")}&size=10&sort=desc&sort_type=score`,
        );
        data = await response.json();
    } catch {
        throw new AppError(502, "PullPush servers are not working");
    }

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
        .slice(20);

    await Promise.all(
        sortedResults.map(async (post) => {
            post.comments = await getComments(post.id);
        }),
    );

    return sortedResults;
};
