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
        if(!subscriptionExists){
            return new Response("You are not subscribed", {status: 400})
        }

        const subreddit = await db.subreddit.findFirst({
            where:{
                id: subbredditId,
                creatorId: session.user.id
            }
        })

        if(subreddit){
            return new Response("You can't unsubscribe from your subreddit", {status: 400})
        }

        await db.subscription.delete({where:{
            userId_subbredditId: {
                subbredditId,
                userId: session.user.id
            }
        }})

        return new Response('', {status: 200})
    }

    catch(err){
        if(err instanceof z.ZodError){
            return new Response("Bad Request", {status: 422})
        }
        return new Response("Couldn't unsubscribe", {status: 500})
    }
}