import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentValidator } from "@/lib/validators/comment"
import { z } from "zod"

export async function PATCH(req: Request){
    try{
        let body = await req.json()
    
    let {postId, replyToId, text} = CommentValidator.parse(body)

    let session = await getAuthSession()

    if(!session?.user) return new Response('Unauthorized access', {status: 401})

    let data = await db.comment.create({data:{
        text,
        authorId: session.user.id,
        replyToId,
        postId
    }})

    return new Response(JSON.stringify(data))
    }
    catch(err){
        if(err instanceof z.ZodError){
            return new Response("Bad Request", {status: 422})
        }
        return new Response("Couldn't create comment", {status: 500})
    }
    
}