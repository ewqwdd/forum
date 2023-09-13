import Link from "next/link"
import { toast, useToast } from "./use-toast"
import { buttonVariants } from "@/components/ui/Button"

export const useCustomToast = ()=>{
    let loginToast = ()=>{
        const {dismiss} = toast({
            title: 'Login required',
            description: 'Please login to do that',
            variant: 'destructive',
            action: (
                <Link href="/sign-in" onClick={()=>dismiss()} className={buttonVariants({variant: "outline"})}>Login</Link>
            )
        })
    }

    return {loginToast}
}