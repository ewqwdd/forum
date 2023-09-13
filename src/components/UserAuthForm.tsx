'use client'

import { cn } from "@/lib/utils";
import { FC, useState } from "react";
import { Button } from "./ui/Button";
import { Icons } from "./Icons";
import {signIn} from "next-auth/react"
import { useToast } from "@/hooks/use-toast";
 
interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement>{}

const UserAuthForm: FC<UserAuthFormProps> = ({className, ...props})=>{

    let [isLoading, setIsLoading] = useState<boolean>(false)
    let {toast} = useToast()


    let loginWIthGoogle = async()=>{
        setIsLoading(true)

        try{
            await signIn('google')
            
        }
        catch(err){
            toast({
                title: "Couldn't login",
                description: "Couldn't login",
                variant: "destructive"
            })
        }
        finally{
            setIsLoading(false)
            
        }
    }

    return(
        <div {...props} className={cn("flex justify-center", className)}>
            <Button onClick={loginWIthGoogle} isLoading={isLoading} size="sm" className="w-full">
                {isLoading ? null : <Icons.google />}
                Google
            </Button>
        </div>
    )
}

export default UserAuthForm