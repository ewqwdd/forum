import MiniCreate from "@/components/MiniCreate"
import PostFeed from "@/components/PostsFeed"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

interface PageProps{
    params:{
        slug: string
    }
}

export default async function Page({params}: PageProps){

    let {slug} = params
    let decoded = decodeURIComponent(slug)

    let session = await getAuthSession()
    let subreddit = await db.subreddit.findFirst({
        where: {
            name: decoded
        },
        include: {
            posts: {
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
                }
        }
    })

    if(!subreddit){
        return notFound()
    }


    return(
        <>
            <h1 className="font-bold text-3xl md:text-4xl h-14">
                {`r/${subreddit.name}`}
            </h1>
    
            <ul className="list-none flex flex-col gap-3">
                <MiniCreate session={session}/>
                <PostFeed subredditName={subreddit.name} initialPosts={subreddit.posts} />
            </ul>
        </>
    )
}