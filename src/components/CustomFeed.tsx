import { getAuthSession } from "@/lib/auth"
import PostFeed from "./PostsFeed"
import { db } from "@/lib/db"


let CustomFeed = async()=>{
    
    let session = await getAuthSession()
    let subscribed = await db.subscription.findMany({
        where: {
            userId: session!.user.id
        }
    })

    let subscribedId = subscribed.map((elem)=>elem.subbredditId)

    let data = await db.post.findMany({
            where:{
                subredditId:{
                    in: subscribedId
                }
            },
            orderBy:{
                createdAt: 'desc'
            },
            include:{
                author: true,
                comments: true,
                subreddit: true,
                votes: true,
            },
            take: 2
    })

    return(
            <ul className="list-none flex flex-col gap-4">
            <PostFeed initialPosts={data} />
            </ul>
    )
}

export default CustomFeed