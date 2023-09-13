'use client'

import { Session } from "next-auth"
import { usePathname, useRouter } from "next/navigation"
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/input";
import { Button } from "./ui/Button";
import { ImageIcon, Link2Icon } from "lucide-react";

interface PageProps{
    session: Session | null;
}

let MiniCreate = ({session}: PageProps)=>{

    let router = useRouter()
    let pathname = usePathname()

    return(
        <li className="overflow-hidden rounded-md bg-white shadow">
            <div className=" px-6 py-4 flex justify-between gap-6">
                <div className="relative z-0">
                    <UserAvatar user={{name: session?.user.name, image: session?.user.image}} />
                    <span className="absolute bottom-0 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
                </div>
                <Input onClick={()=>router.push(pathname + "/submit")} placeholder="Create post"/>
                <Button onClick={()=>router.push(pathname + "/submit")} variant='ghost'>
                    <ImageIcon />
                </Button>
                <Button onClick={()=>router.push(pathname + "/submit")} variant='ghost'>
                    <Link2Icon />
                </Button>
            </div>
        </li>
    )
}

export default MiniCreate