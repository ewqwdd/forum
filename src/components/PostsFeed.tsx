'use client'
import { POSTS_LIMIT } from "@/config";
import { ExtendedPost } from "@/types/extendedPost";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { FC, useEffect, useRef, useState } from "react";
import {useIntersection} from "@mantine/hooks"
import Post from "./Post";
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";

interface PageProps{
    subredditName?: string;
    initialPosts: ExtendedPost[];
}

const PostFeed: FC<PageProps> = ({subredditName, initialPosts})=>{

    let lastElem = useRef<HTMLDivElement>(null)
    let {data: session} = useSession()
    let {entry, ref} = useIntersection({root: lastElem.current, threshold: 1})

    let {data, fetchNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: async({ pageParam = 1 })=>{
            let {data} = await axios.get(`/api/posts?limit=${POSTS_LIMIT}&page=${pageParam}&subredditName=${subredditName ? subredditName : ''}`)
            
            return data as ExtendedPost[]
        },
        getNextPageParam: (lastPage, allPages)=>allPages.length+1,
        initialData: {pages: [initialPosts], pageParams: [1]}
    })

    useEffect(()=>{
        if(entry?.isIntersecting){
            fetchNextPage()
        }
        
    }, [entry, fetchNextPage])

    let posts = data?.pages.flatMap((elem)=>elem) ?? initialPosts

    return(
        <>
            {posts.map((elem, index)=>(
            <li key={elem.id} {...{ref: index===posts.length-1 ? ref : null}}>
                <Post post={elem} session={session} />
            </li>))}
            {isFetchingNextPage ? <div className="w-full flex justify-center"><Loader2 className="w-10 h-10 animate-spin"/></div>: null}
        </>
    )
}

export default PostFeed