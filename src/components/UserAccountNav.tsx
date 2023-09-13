'use client'
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { User } from "next-auth"
import { FC } from "react"
import UserAvatar from "./UserAvatar"
import { signOut } from "next-auth/react"

interface UserAccountNavProps{
    user: Pick<User, 'image' | 'name' | 'email'>
}

let UserAccountNav: FC<UserAccountNavProps> = ({user})=>{



    return(
        <DropdownMenu>
            <DropdownMenuTrigger>
                <UserAvatar className="h-8 w-8" user={user} />
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-white" align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                        {user.name && <p className="font-medium">{user.name}</p>}
                        {user.email && <p className="w-[200px] truncate text-zinc-700 text-sm">{user.email}</p>}
                    </div>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/">Feed</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/r/create">Create</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer" onSelect={()=>{
                    signOut()
                }} 
                asChild>
                    <p>Sign Out</p>
                </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserAccountNav