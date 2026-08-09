import {
    MAX_COMMENT_LENGTH,
    MAX_COMMENTS,
    MINIMUM_UPVOTES,
} from "../constants/pipeline.constants.js";
import { Comment } from "../types/contentItem.js";
import AppError from "../utils/AppError.js";

export const getComments = async (postId: string): Promise<Comment[]> => {
    let response, data;

    try {
        response = await fetch(
            `https://api.pullpush.io/reddit/search/comment/?link_id=${postId}&size=10`,
        );
        data = await response.json();
    } catch {
        throw new AppError(502, "PullPush servers are not working");
    }

    if (!response.ok) {
        throw new AppError(response.status, "PullPush request failed");
    }

    const comments: Comment[] = [];

    data.data.forEach((item) => {
        comments.push({
            author: item.author,
            comment: item.comment,
            engagement: item.score,
        });
    });

    const sortedComments = comments
        .filter((comment) => comment.engagement >= MINIMUM_UPVOTES)
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, MAX_COMMENTS);

    for (const comment of sortedComments) {
        comment.comment.slice(0, MAX_COMMENT_LENGTH);
    }

    return sortedComments;
};
