import CommentsSection from "@/components/CommentsSection";
import EditorOutput from "@/components/EditorOutput";
import PostVotesServer from "@/components/PostVotesServer";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { formatDistanceSimple } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { FC, Suspense } from "react";

interface PageProps{
    params:{
        postId: string
    }
}

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

let Page = async({params}: PageProps)=>{

    let session = await getAuthSession()

    const cachedPost = await redis.hgetall(`post:${params.postId}`) as CachedPost

    let post: (Post & {votes: Vote[], author: User}) | null = null

    if(!cachedPost){
        post = await db.post.findFirst({
            where:{
                id: params.postId
            },
            include:{
                author: true,
                votes: true,
            }
        })
    }

    if(!post && !cachedPost){
        return notFound()
    }

    return(
    <div>
        <div className="h-full flex flex-col sm:flex-row justify-between items-center sm:items-start">
            <Suspense fallback={<Loader2 className="animate-spin h-10 w-10"/>}>
                {/* @ts-expect-error */}
                <PostVotesServer postId={post?.id ?? cachedPost.id} getData={ post?.votes ? undefined : 
                async()=>{
                    return await db.post.findUnique({where: {
                        id: params.postId
                    }, 
                    include:{
                        votes: true
                    }})
                }} 
                initialVote={post?.votes ? post.votes.find((elem)=>elem.userId===session?.user.id)?.type : undefined}
                initialVoteAmt={post?.votes ? post.votes.reduce(
                    (acc, elem)=>{
                        if(elem.type==='UP') return acc+1
                        if(elem.type==='DOWN') return acc-1
                        return acc
                    }, 0
                    ) : undefined}
                />
            </Suspense>

            <div className="sm:w-0 w-full flex-1 bg-white rounded-sm p-4">
                <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
                    Posted by u/{post?.author.username ?? cachedPost.authorUsername}{' '}
                    {formatDistanceSimple(new Date(post?.createdAt ?? cachedPost.createdAt))}
                </p>
                <h1 className='text-xl font-semibold py-2 leading-6 text-gray-900'>
                    {post?.title ?? cachedPost.title}
                </h1>
                <EditorOutput content={post?.content ?? cachedPost.content}/>
                <Suspense fallback={<Loader2 className="animate-spin h-10 w-10"/>} >
                {/* @ts-expect-error */}
                <CommentsSection postId={post?.id ?? cachedPost.id} />
            </Suspense>
            </div>
            
        </div>
        
    </div>)
}

export default Page