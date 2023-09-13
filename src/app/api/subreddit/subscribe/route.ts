import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddits"
import { z } from "zod"


export async function POST(req: Request){
    try{
        
        const session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorized', {status: 401})
        }

        const body = await req.json()

        const {subredditId: subbredditId} = SubredditSubscriptionValidator.parse(body)

        const subscriptionExists = await db.subscription.findFirst({where: {
            subbredditId,
            userId: session.user.id
        }})
        if(subscriptionExists){
            return new Response("You are already subscribed to this subreddit", {status: 400})
        }
        await db.subscription.create({data:{
            subbredditId,
            userId: session.user.id
        }})

        return new Response('', {status: 200})
    }

    catch(err){
        if(err instanceof z.ZodError){
            return new Response("Bad Request", {status: 422})
        }
        return new Response("Couldn't subscribe", {status: 500})
    }
}