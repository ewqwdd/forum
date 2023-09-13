import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { PostValidator } from "@/lib/validators/post"
import { z } from "zod"

export async function POST(req: Request) {
    try{
        let body = await req.json()
        
        let {subredditId, content, title} = PostValidator.parse(body)

        let session = await getAuthSession()
        if(!session?.user){
            return new Response('Login to create a post', {status: 401})
        }

        let subreddit = await db.subreddit.findFirst({
            where: {
                id: subredditId
            }
        })

        if(!subreddit){
            return new Response("Subreddit doesn't exist", {status: 400})
        }
        
        let isSubscribed = await db.subscription.findFirst({
            where: {
                subbredditId: subredditId,
                userId: session.user.id
            }
        })

        if(!isSubscribed){
            return new Response("You are not subscribed on this subreddit", {status: 400})
        }

        let post = await db.post.create({
            data:{
                title,
                authorId: session.user.id,
                subredditId,
                content
            }
        })

        return new Response(JSON.stringify(post), {status: 200})
    }
    catch(err){
        if(err instanceof z.ZodError){
            return new Response("Bad Request", {status: 422})
        }
        return new Response("Couldn't subscribe", {status: 500})
    }
}