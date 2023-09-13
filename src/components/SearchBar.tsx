'use client'
import { CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { Command } from "./ui/command"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useCallback, useRef, useState } from "react"
import { Prisma, Subreddit } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Users } from "lucide-react"
import { useClickOutside } from "@/hooks/clickOutside"

const SearchBar = ()=>{

    let [input, setInput] = useState<string>('')

    const router = useRouter()

    let search = useRef<HTMLDivElement>(null)

    const useDebounce = (func: ()=>any)=>{
        let timer: NodeJS.Timeout;
        return useCallback(()=>{
            timer && clearTimeout(timer)
            timer = setTimeout(()=>{
                func()
            }, 200)
        }, [])
    }

    let {data, refetch, isFetched, isFetching} = useQuery({
        queryFn: async()=>{
            if(input.length===0){
                return []
            }
            let {data} = await axios.get(`/api/subreddit/search?query=${input}`)
            return data as (Subreddit & {_count: Prisma.SubredditCountOutputType})[]
        },
        queryKey: ['search-query'],
        enabled: false
    })

    let request = useDebounce(()=>{
        refetch()
    })

    useClickOutside(search, ()=>{
        setInput('')
    })

    return(
        <Command ref={search} className="relative rounded-lg border max-w-lg z-50 overflow-visible">
            <CommandInput
            value={input}
            onValueChange={(search)=>{
                setInput(search)
                request()
            }} 
            className="outline-none border-none focus:border-none focus:outline-none ring-0 h-9" 
            placeholder="Search communities.."/>
            {input.length>0 ?
            <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
                {isFetched && <CommandEmpty>No results found.</CommandEmpty>}
                {(data?.length ?? 0) > 0 ?
                <CommandGroup heading="Communities">
                    {data?.map(elem=><CommandItem key={elem.id} value={elem.name} onSelect={(e)=>{
                        router.push(`/r/${e}`)
                        router.refresh()
                }}>
                    <Users className="mr-2 h-4 w-4"/>
                    <a href={`/r/${elem.name}`}>r/{elem.name}</a>
                </CommandItem>)}
                </CommandGroup> : null}
            </CommandList>
            : null}
        </Command>
    )
}

export default SearchBar