import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { VotePostValidator } from "@/lib/validators/vote"
import { CachedPost } from "@/types/redis"
import { z } from "zod"

export async function PATCH(req: Request){

    try{
        let body = await req.json()

        let {postId, type} = VotePostValidator.parse(body)

        let session = await getAuthSession()
        if(!session?.user){
            return new Response('Unauthorized access', {status: 401})
        }

        let post = await db.post.findFirst({where:{
            id: postId
        }, include:{
            author: true,
            votes: true
        }})

        if(!post){
            return new Response('Invalid data', {status: 422})
        }
        let data
        let vote = post.votes.find((elem)=>elem.userId === session?.user.id && elem.postId === post?.id)
        if(vote?.type===type){
            data = await db.vote.delete({where: {
                userId_postId:{
                    userId: session.user.id,
                    postId
                }
            }})
            
        }
        else if(!vote){
            data = await db.vote.create({data:{
                postId,
                userId: session.user.id,
                type
            }})
            
        }
        else{
            data = await db.vote.update({where:{
                userId_postId:{
                    postId,
                    userId: session.user.id
                }
            }, data:{
                type
            }})
        }

        let votesAmt = post.votes.reduce((acc, elm)=>{
            if(elm.type==='UP'){
                return acc+1
            }
            if(elm.type==='DOWN'){
                return acc-1
            }
            return acc
        }, 0)

        if(votesAmt>3){
            let payload: CachedPost = {
                authorUsername: post.author.username,
                content: JSON.stringify(post.content),
                id: post.id,
                createdAt: post.createdAt,
                title: post.title
            }
            redis.hset(`post:${post.id}`, payload)
        }

        return new Response(JSON.stringify(data))
    }
    catch(err){
        if(err instanceof z.ZodError){
            return new Response("Bad Request", {status: 422})
        }
        return new Response("Couldn't subscribe", {status: 500})
    }

    
}

