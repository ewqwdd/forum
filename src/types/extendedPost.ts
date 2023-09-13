import type { Comment, Post, Subreddit, User, Vote } from "@prisma/client";

export type ExtendedPost = Post & {
    comments: Comment[],
    votes: Vote[],
    author: User,
    subreddit: Subreddit
}