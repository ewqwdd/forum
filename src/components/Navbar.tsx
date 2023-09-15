import Link from "next/link"
import { Icons } from "./Icons"
import { buttonVariants } from "./ui/Button"
import { getServerSession } from "next-auth"
import UserAccountNav from "./UserAccountNav"
import SearchBar from "./SearchBar"
import { cn } from "@/lib/utils"

const Navbar = async()=>{

    let session = await getServerSession()

    return(
        <div id="nav" className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border=zinc-300 z-50 py-2 flex justify-center">
            <div className="container max-w-7x1 h-full flex items-center justify-between gap-2">

                {/* Logo */}
                <Link href="/" className="flex gap-2 items-center">
                    <Icons.logo className="md:h-8 md:w-8 h-6 w-6"/>
                    <p className="text-zinc-700 text-sm font-medium md:block hidden">
                        Forum
                    </p>
                </Link >

                <SearchBar />
                
                {session?.user ? 
                    <UserAccountNav user={session.user}/>: 
                    <Link href="/sign-in" className={cn(buttonVariants(), "w-16 sm:w-20")}>Sign In</Link>
                }
                
            </div>
        </div>
    )
}

export default Navbar