'use client'

import { Button } from "./ui/Button";
import { FC, useTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddits";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


interface PageProps{
    isSubscribed: boolean;
    subredditId: string;
    subredditName: string
}

let SubscribeToggle: FC<PageProps> = ({isSubscribed, subredditId, subredditName})=>{

    let router = useRouter()
    let [isPending, startTransition] = useTransition()

    let {mutate: subscribe, isLoading: subscribeLoading} = useMutation({
        mutationFn: async()=>{
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }
            const {data} = await axios.post("/api/subreddit/subscribe", payload)
            return data as string
        },
        onError: (err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status === 400){
                    return toast({
                        title: 'You are alredy subscribed',
                        description: "You can't subscribe twice on one subreddit",
                        variant: "destructive"
                    })
                }
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
                description: "You haven't been subscribed",
                variant: 'destructive'
            })
        },
        onSuccess: ()=>{
            startTransition(()=>{
                router.refresh()
            })
            toast({
                title: `Subscribed to ${subredditName}`,
                description: `You successfully subscribed to ${subredditName}`
            })
        }
    })

    let {mutate: unSubscribe, isLoading: unSubscribeLoading} = useMutation({
        mutationFn: async()=>{
            const payload: SubscribeToSubredditPayload = {
                subredditId
            }
            const {data} = await axios.post("/api/subreddit/unsubscribe", payload)
            return data as string
        },
        onError: (err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status === 400){
                    return toast({
                        title: 'You are not subscribed',
                        description: "You can't unsubscribe if you are not subscribed",
                        variant: "destructive"
                    })
                }
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
            startTransition(()=>{
                router.refresh()
            })
            toast({
                title: `Unsubscribed to ${subredditName}`,
                description: `You successfully unsubscribed from ${subredditName}`
            })
        }
    })

    return(

        <>
            {isSubscribed ? 
            <Button variant="destructive" isLoading={unSubscribeLoading} onClick={()=>unSubscribe()} className="w-full mt-1 mb-4 text-zinc-900">Leave</Button>:
            <Button className="w-full mt-1 mb-4" isLoading={subscribeLoading} onClick={()=>{subscribe()}}>Join to post</Button>}
        </>
    )
}

export default SubscribeToggle

function loginToast(): unknown {
    throw new Error("Function not implemented.");
}
