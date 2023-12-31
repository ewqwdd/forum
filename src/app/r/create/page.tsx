'use client'

import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {useMutation} from "@tanstack/react-query"
import { CreateSubredditPayload } from "@/lib/validators/subreddits"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/useCustomToast"

let Page = ()=>{
    const [input, setInput] = useState<string>('')
    const router = useRouter()
    const {loginToast} = useCustomToast()

    let {mutate, isLoading} = useMutation({
        mutationFn: async()=>{
            const payload: CreateSubredditPayload = {
                name: input,
            }

            const {data} = await axios.post("/api/subreddit", payload)
            return data as string
        },
        onError: (err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status === 409){
                    return toast({
                        title: 'Subreddit already exists',
                        description: 'Please, choose different Subreddit name',
                        variant: "destructive"
                    })
                }
                if(err.response?.status === 422){
                    return toast({
                        title: 'Invalid name',
                        description: 'Please choose a name between 3 and 21 characters',
                        variant: "destructive"
                    })
                }
                if(err.response?.status === 401){
                    return loginToast()
                }
            }
            return toast({
                title: "There was an error",
                description: "Subreddit is not created",
                variant: 'destructive'
            })
        },
        onSuccess: (data)=>{
            router.push(`/r/${data}`)
        }
    })

    return(
        <div className="container flex items-center h-full max-w-3xl mx-auto">
            <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
                <div className="justify-between flex items-center">
                    <h1 className="text-xl font-semibold">Create a community</h1>
                </div>

                <hr className="bg-zinc-500" />

                <p className="text-lg font-medium">Name</p>
                <p className="text-xs pb-2">Community names including capitalization cannot be changed</p>
                <div className="relative">
                    <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
                        r/
                    </p>
                    <Input value={input} onChange={e=>setInput(e.target.value)} className="pl-6" />
                </div>
                <div className="flex justify-end gap-4">
                    <Button variant='subtle' onClick={()=>{router.back()}}>Cancel</Button>
                    <Button 
                    isLoading={isLoading} 
                    disabled={input.length<3} 
                    onClick={()=>mutate()}>
                        Create Community
                    </Button>
                </div>
            </div>
        </div>
    )

}

export default Page