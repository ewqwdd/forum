'use client'
import { UsernameType, UsernameValidator } from "@/lib/validators/username"
import { zodResolver } from "@hookform/resolvers/zod"
import { User } from "@prisma/client"
import { useForm } from "react-hook-form"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Button } from "./ui/Button"
import { useMutation } from "@tanstack/react-query"
import axios, { AxiosError } from "axios"
import { toast } from "@/hooks/use-toast"
import { useCustomToast } from "@/hooks/useCustomToast"
import { useRouter } from "next/navigation"

interface UserNameFormProps extends React.HTMLAttributes<HTMLFormElement> {
    user: Pick<User, 'id' | 'username'>
  }

let UserNameForm = ({user}: UserNameFormProps)=>{
    let {loginToast} = useCustomToast()
    let router = useRouter()

    const {handleSubmit, register, formState} = useForm<UsernameType>({
        resolver: zodResolver(UsernameValidator),
        defaultValues:{
            username: user?.username || ''
        },
        
    })

    let {mutate, isLoading} = useMutation({
        mutationFn: async({username}: UsernameType)=>{
            const payload: UsernameType = {
                username
            }

            let {data} = await axios.patch('/api/username', payload)

            return data
        },
        onError: (err)=>{
            if(err instanceof AxiosError){
                if(err.response?.status === 409){
                    return toast({
                        title: 'Username already exists',
                        description: 'Please, choose another username',
                        variant: "destructive"
                    })
                }
                if(err.response?.status === 422){
                    return toast({
                        title: 'Invalid name',
                        description: 'Please choose a name between 3 and 14 characters',
                        variant: "destructive"
                    })
                }
                if(err.response?.status === 401){
                    return loginToast()
                }
            }
            return toast({
                title: "There was an error",
                description: "Username wasn't changed",
                variant: 'destructive'
            })
        },
        onSuccess: ()=>{
            toast({
                description: "Your username has been updated"
            })
            router.refresh()
        }
    })

    return(
    <form onSubmit={handleSubmit((e)=>{
        mutate(e)
    })}>
        <Card>
            <CardHeader>
                <CardTitle>
                    Your username
                </CardTitle>
                <CardDescription>
                    Please enter a display name you are comfortable with
                </CardDescription>
            </CardHeader>

                <div className="mx-6 relative grid gap-1">
                    <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
                        <span className="text-sm text-zinc-400">
                            u/
                        </span>
                    </div>
                    <Label htmlFor="name" className="sr-only">
                        Name
                    </Label>
                    <Input id='name' className="w-[400px] pl-6 text-zinc-700" size={32} {...register('username')} />
                    {formState.errors.username && 
                    <p className="px-1 text-xs text-red-600">
                        {formState.errors.username.message}    
                    </p>}
                </div>
            <CardFooter className="p-6">
                <Button isLoading={isLoading}>Change name</Button>
            </CardFooter>
        </Card>
    </form>)
}

export default UserNameForm