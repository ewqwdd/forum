"use client"
import { usePrevious } from "@mantine/hooks";
import { Post, User, Vote, VoteType } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import axios, { Axios, AxiosError } from "axios";
import { VotePostType } from "@/lib/validators/vote";
import { useCustomToast } from "@/hooks/useCustomToast";
import { toast } from "@/hooks/use-toast";

interface PageProps { 
    postId: string
    initialVotesAmt: number
    initialVote?: VoteType | null
}

const PostVotes: FC<PageProps> = ({initialVotesAmt, postId, initialVote})=>{
    
    let [currentVote, setCurrentVote] = useState(initialVote)
    let [votesAmt, setVotesAmt] = useState<number>(initialVotesAmt)
    let prevVote = usePrevious(currentVote)
    let {loginToast} = useCustomToast()

    useEffect(()=>{
        setCurrentVote(initialVote)
    }, [initialVote])

    let {mutate} = useMutation({
        mutationFn: async(type: VoteType)=>{
            let payload: VotePostType = {
                type,
                postId,
            }
            let {data} = await axios.patch("/api/subreddit/post/vote", payload)
            return data as Vote
        },
        onError: (err, type)=>{
           if(type === 'UP') setVotesAmt(prev=>prev-1)
           else setVotesAmt(prev=>prev+1)

           setCurrentVote(prevVote)

           if(err instanceof AxiosError){
            return loginToast()
           }

           return toast({
            title: 'Something went wrong',
            description: 'Vote is npt saved',
            variant: 'destructive'
           })
        },
        onMutate: (type)=>{
            if(currentVote === type){
                setCurrentVote(null)
                if(type==='UP') setVotesAmt(prev=>prev-1)
                else if(type==='DOWN') setVotesAmt(prev=>prev+1)
            }
            else{
                setCurrentVote(type)
                if(type==='UP') setVotesAmt(prev=>prev+(currentVote ? 2 : 1))
                else if(type==='DOWN') setVotesAmt(prev=>prev-(currentVote ? 2 : 1))
            }

        }
    })

    return(
        <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
            <Button onClick={()=>mutate('UP')} size='sm' variant='ghost' aria-label='upvote' className="">
                <ArrowBigUp className={cn('h-5 w-5 text-zinc-500', currentVote === 'UP' ? 'text-emerald-500 fill-emerald-500' : '')} />
            </Button>
            <p className="text-center py-2 font-medium text-sm text-zinc-900">
                {votesAmt}
            </p>
            <Button onClick={()=>mutate('DOWN')} size='sm' variant='ghost' aria-label='upvote' className="">
                <ArrowBigDown className={cn('h-5 w-5 text-zinc-500', currentVote === 'DOWN' ? 'text-red-500 fill-red-500' : '')} />
            </Button>
        </div>
    )
}

export default PostVotes;