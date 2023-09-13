import { User } from "next-auth"
import { FC } from "react"
import { Avatar, AvatarFallback } from "./ui/avatar"
import Image from "next/image"
import { Icons } from "./Icons"
import { AvatarProps } from "@radix-ui/react-avatar"

interface UserAvatarProps extends AvatarProps{
    user: Pick<User, 'image' | 'name'>
}

let UserAvatar: FC<UserAvatarProps> = ({user, ...props})=>{

    return(
        <Avatar {...props}>
            {user.image ? 
            <div className="aspect-square relative h-full w-full ">
                <Image fill src={user.image} referrerPolicy="no-referrer" alt="profile picture" />
            </div> : 
            <AvatarFallback>
                <span className="sr-only">{user.name}</span>    
                <Icons.user />
            </AvatarFallback>}
        </Avatar>
    )
}

export default UserAvatar