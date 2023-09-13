'use client'
import { Comment, CommentVote, User } from "@prisma/client";
import { FC, useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { formatDistanceSimple } from "@/lib/utils";
import CommentVotes from "./CommentVotes";
import { useSession } from "next-auth/react";
import { Button } from "./ui/Button";
import { MessageSquare } from "lucide-react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentType } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/useCustomToast";
import { useRouter } from "next/navigation";

interface PageProps{
    comment: Comment & {votes: CommentVote[], author: User}
    postId: string
    replyTo?: string
}

const CommentComp: FC<PageProps> = ({comment, postId, replyTo})=>{

    let ref = useRef<HTMLDivElement>(null)
    let [isReplying, setIsReplying] = useState<boolean>(false)
    let [input, setInput] = useState<string>('')
    let session = useSession()
    let {loginToast} = useCustomToast()
    let router = useRouter()

    let {isLoading, mutate} = useMutation({
        mutationFn: async({postId, text, replyToId}: CommentType)=>{
            const payload: CommentType = {
                postId,
                text,
                replyToId
            }
            const {data} = await axios.patch(`/api/subreddit/post/comment`, payload)
            return data
        },
        onError: (err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status === 422){
                    return toast({
                        title: 'Invalid data',
                        description: 'Invalid data',
                        variant: "destructive"
                    })
                }
                if(err.response?.status === 401){
                    return loginToast()
                }
            }
            return toast({
                title: "There was an error",
                description: "You haven't been unsubscribed",
                variant: 'destructive'
            })
        },
        onSuccess: ()=>{
            router.refresh()
            setInput('')
            toast({
                title: 'Comment published',
                description: 'Comment successfully added'
            })
        }
    })

    let voteAmt = comment.votes.reduce((acc, elem)=>{
        if(elem.type==='UP') return acc+1
        if(elem.type==='DOWN') return acc-1
        return acc
    }, 0)

    let CurrentVote = comment.votes.find(elem=>elem.userId===session.data?.user.id)?.type

    return(
        <div ref={ref} className="flex flex-col">
            <div className="flex items-center">
                <UserAvatar user={{
                    name: comment.author.name,
                    image: comment.author.image
                }}
                className="h-6 w-6"
                />

            
                <div className="ml-2 flex items-center gap-x-2">
                    <p className="text-sm font-medium text-gray-900">u/{comment.author.username}</p>
                    <p className="max-h-40 truncate text-xs text-zinc-500">{' '}
                        {formatDistanceSimple(new Date(comment.createdAt))}</p>
                </div>
            </div>
            <p className='text-sm text-zinc-900 mt-2'>{comment.text}</p>
            <div className="flex gap-2 items-center">
                <CommentVotes initialVote={CurrentVote} initialVotesAmt={voteAmt} commentId={comment.id} />
                <Button variant='ghost' size='xs' aria-label="reply" onClick={()=>setIsReplying(isReplying ? false : true)}>
                    <MessageSquare className="h-4 w-4 mr-1.5"/>
                    Reply
                </Button>
                
            </div>
            {isReplying ? <div className="grid w-full gap-1.5">
                    <div className="mt-2">
                        <Textarea id="comment" placeholder='What are your thoughts?' rows={1} value={input} onChange={(e)=>{
                            setInput(e.target.value)
                        }} />
                        <div className="mt-2 flex justify-end">
                            <Button isLoading={isLoading} disabled={input.length===0} onClick={()=>{mutate({postId, text: input, replyToId: replyTo ?? comment.id})}}>
                                Post
                            </Button>
                        </div>
                    </div>
                </div>: null}
        </div>
    )
}

export default CommentComp