import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddits";
import { z } from "zod";

export async function POST(req: Request){
    try{
        let session = await getAuthSession()

        if(!session?.user){
            return new Response('Unauthorized', {status: 401})
        }

        const body = await req.json()
        const {name} = SubredditValidator.parse(body)

        const isSubreddit = await db.subreddit.findFirst({where:{name}})
        if(isSubreddit){
            return new Response('Subreddit with this name already exists', {status: 409})
        }
        const subreddit = await db.subreddit.create({
            data:{
                name,
                creatorId: session.user.id,
            }
        })

        await db.subscription.create({
            data:{
                userId: session.user.id,
                subbredditId: subreddit.id
            }
        })

        return new Response(name)

    }
    catch(err){
        if(err instanceof z.ZodError){
            return new Response("Bad Request", {status: 422})
        }
        return new Response("Couldn't create subreddit", {status: 500})
    }
}