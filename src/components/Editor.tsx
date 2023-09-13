'use client'
import TextareaAutosize from "react-textarea-autosize"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { PostType, PostValidator } from "@/lib/validators/post"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { useInitEditor } from "@/hooks/useInitEditor"
import { toast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { usePathname, useRouter } from "next/navigation"
import { useCustomToast } from "@/hooks/useCustomToast"
import { Loader, Loader2 } from "lucide-react"

interface EditProps{
    subredditId: string
}

const Editor: FC<EditProps> = ({subredditId})=>{

    const {register, handleSubmit, formState: {errors}, } = useForm<PostType>({
        resolver: zodResolver(PostValidator),
        defaultValues:{
            subredditId,
            title: '',
            content: null
        },
    })
    let _titleRef = useRef<HTMLTextAreaElement>()

    let {loginToast} = useCustomToast()
    let pathname = usePathname()
    let router = useRouter()

    let [isMounted, setIsMounted] = useState<boolean>(false)
    useEffect(()=>{
        if(typeof window !==undefined){
            setIsMounted(true)
        }
    }, [])

    
    let [initializeEditor, ref] = useInitEditor()
    

    useEffect(()=>{
        let init = async()=>{
            await initializeEditor().then(()=>{_titleRef.current!.focus()})
        }
        if(isMounted){
            init()
        }
        return ()=>{
            ref.current?.destroy()
            //@ts-ignore
            ref.current = undefined
        }
    }, [isMounted, initializeEditor])

    useEffect(()=>{
        if (Object.keys(errors).length){
            for(let [key, value] of Object.entries(errors)){
                toast({
                    title: 'Something went wrong!',
                    description: (value as {message: string}).message,
                    variant: 'destructive'
                })
            }
        }
    }, [errors])

    let {ref: titleRef, ...rest} = register('title')

    let {mutate, isLoading} = useMutation({
        mutationFn: async(payload: PostType)=>{
            let {data} = await axios.post('/api/subreddit/post/create', payload)
            return data
        },
        onSuccess: ()=>{
            let path = pathname.split('/').slice(0, -1).join('/')
            router.push(path)
            router.refresh()
        },
        onError: (err)=>{
            if(err instanceof AxiosError){
                if(err.status===401){
                    return loginToast()
                }
                else if(err.status===400){
                    return toast({
                        title: 'You are not subscribed',
                        description: 'Subscribe on this subreddit to contribute',
                        variant: 'destructive'
                    })
                }
                else{
                    return toast({
                        title: 'Something went wrong!',
                        description: err.message,
                        variant: 'destructive'
                    })
                }
                
            }
        }
    })

    let onSubmit = async(data: PostType)=>{
        let content = await ref.current?.save()
        let title = data.title
        mutate({title, content, subredditId})
    }

    return(
        <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200 relative">
            {isLoading && <div className="absolute top-0 left-0 w-full h-full bg-slate-600 bg-opacity-20 flex items-center justify-center">
                <Loader2 className="animate-spin"/>
            </div>}
            <form id="subreddit-edit-form" className="w-fit" onSubmit={handleSubmit(onSubmit)}>
                <div className="prose prose-stone dark:prose-invert">
                    <TextareaAutosize ref={(e)=>{
                        titleRef(e)
                        //@ts-ignore
                        _titleRef.current = e
                    }} 
                    {...rest}
                    placeholder="Title" className="font-semibold w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl focus:outline-none"/>
                </div>
                <div className="w-full min-h-[500px]" id='editor' />
            </form>
        </div>
    )
}

export default Editor