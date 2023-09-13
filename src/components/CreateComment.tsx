'use client'
import { FC, useState } from "react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Button } from "./ui/Button"
import { useMutation } from "@tanstack/react-query"
import { CommentType } from "@/lib/validators/comment"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/useCustomToast"
import { useRouter } from "next/navigation"

interface PageProps{
    postId: string
    replyToId?: string
}

const CreateComment: FC<PageProps> = ({postId, replyToId})=>{

    const [input, setInput] = useState<string>('')
    let {loginToast} = useCustomToast()
    let router = useRouter()

    const {mutate, isLoading} = useMutation({
        mutationFn: async({postId, replyToId, text}:CommentType)=>{
            let payload: CommentType = {
                postId,
                replyToId,
                text
            }
            const {data} = await axios.patch('/api/subreddit/post/comment', payload)
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

    return(
        <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2">
                <Textarea id="comment" placeholder='What are your thoughts?' rows={1} value={input} onChange={(e)=>{
                    setInput(e.target.value)
                }} />
                <div className="mt-2 flex justify-end">
                    <Button isLoading={isLoading} disabled={input.length===0} onClick={()=>{mutate({postId, text: input, replyToId})}}>
                        Post
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default CreateComment