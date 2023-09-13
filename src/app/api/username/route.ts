import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { UsernameValidator } from "@/lib/validators/username"
import { z } from "zod"

export async function PATCH(req: Request) {
    try{
        
        let body = await req.json()
        let {username} = UsernameValidator.parse(body)
        let session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorized access', {status: 401})
        }

        let ifExists = await db.user.findFirst({where:{
            username
        }})
        if(ifExists){
            return new Response('This username is taken', {status: 409})
        }

        await db.user.update({
            where:{
                id: session.user.id
            },
            data:{
                username
            }
        })

        return new Response('Username changed')
    }
    catch(err){
        if(err instanceof z.ZodError){
            return new Response("Bad Request", {status: 422})
        }
        return new Response("Couldn't fetch posts", {status: 500})

    }
}