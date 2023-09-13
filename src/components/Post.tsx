import { formatDistanceSimple } from "@/lib/utils";
import { ExtendedPost } from "@/types/extendedPost"
import { MessageSquare } from "lucide-react";
import { Session } from "next-auth";
import { FC, RefObject, useRef } from "react"
import EditorOutput from "./EditorOutput";
import PostVotes from "./PostVotes";

interface PageProps{
    post: ExtendedPost;
    session?: Session | null;
}

let Post:FC<PageProps> = ({post, session})=>{

    let pRef = useRef<HTMLDivElement>(null)

    let votes = post.votes
    let finalVote = votes.reduce((acc, curr)=>{
        if(curr.type === "DOWN"){
            return acc-1
        }
        if(curr.type === "UP"){
            return acc+1
        }
        return acc
    }, 0)

    let commentsAmt = post.comments.length

    let currentVote = post.votes.find(vote=>vote.userId===session?.user.id)

    return(
        <div className="rounded-md shadow bg-white">
            <div className="px-6 py-4 flex justify-between items-center">
            <PostVotes initialVote={currentVote?.type} initialVotesAmt={finalVote} postId={post.id} />
                <div className="w-0 flex-1">
                    <div className="max-h-40 mt-1 text-xs text-gray-500">
                        {post.subreddit.name ? 
                        <>
                        <a className="underlined text-zinc-900 text-sm underline-offset-2" href={`/r/${post.subreddit.name}`}>
                            r/{post.subreddit.name}
                        </a>

                        <span className="px-1">•</span>

                        
                        </>
                        : null}
                        <span>Posted by u/{post.author.username}</span>
                        {' '}
                        {formatDistanceSimple(new Date(post.createdAt))}
                    </div>
                    <a href={`/r/${post.subreddit.name}/post/${post.id}`}>
                        <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900 inline-block">
                            {post.title}
                        </h1>
                    </a>

                    <div className="overflow-clip relative text-sm max-h-40 w-full" ref={pRef}>
                            <EditorOutput content={post.content} />
                            {pRef.current?.clientHeight === 160 ? 
                            <div className="absolute z-20 w-full h-24 bg-gradient-to-t from-white to-transparent bottom-0" />:
                            null}
                    </div>
                    <div className="bg-gray-50 z-20 text-sm p-4 sm:px-6">
                        <a className='w-fit flex items-center gap-2' href={`/r/${post.subreddit.name}/post/${post.id}`}>
                            <MessageSquare className="h-4 w-4 " /> {commentsAmt} comments
                        </a>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default Post