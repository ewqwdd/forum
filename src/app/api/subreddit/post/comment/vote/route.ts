import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { CommentVoteValidator } from "@/lib/validators/comment"
import { z } from "zod"

export async function PATCH(req: Request){
    try{
        let body = await req.json()

        let {commentId, type} = CommentVoteValidator.parse(body)

        let session = await getAuthSession()
        if(!session?.user) return new Response("Unauthorized access", {status: 401})

        let vote = await db.commentVote.findFirst({where:{
            commentId,
            userId: session.user.id
        }})
        
        if(!vote){
            let data = await db.commentVote.create({data:{
                type,
                commentId,
                userId: session.user.id
            }})
            return new Response(JSON.stringify(data))
        }
        if(type===vote.type){
            await db.commentVote.delete({
                where:{
                    userId_commentId:{
                        commentId,
                        userId: session.user.id
                    }
                }
            })
            return new Response('Deleted')
        }
        let data = await db.commentVote.update({where:{
            userId_commentId:{
                commentId,
                userId: session.user.id
            }
        }, data:{
            type
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