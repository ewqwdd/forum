import { db } from "@/lib/db";
import PostFeed from "./PostsFeed";

export default async function GeneralFeed() {
    let posts = await db.post.findMany({
        orderBy:{
            createdAt: 'desc'
        },
        take: 2,
        include:{
            author: true,
            comments: true,
            subreddit: true,
            votes: true
        }
    })

    return(
        <ul className="list-none flex flex-col gap-4">
            <PostFeed initialPosts={posts}/>
        </ul>
    )
}