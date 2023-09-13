import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { GetPostsValidator } from "@/lib/validators/getPosts"
import { z } from "zod"

export async function GET(req: Request){

    try{
        let url = new URL(req.url)

        let session = await getAuthSession()

        let {limit, page, subredditName} = GetPostsValidator.parse({
            limit: url.searchParams.get("limit"),
            page: url.searchParams.get("page"),
            subredditName: url.searchParams.get("subredditName")
        })

        let whereClause = {}

        if(subredditName){
        whereClause = {
            subreddit:{
                name: subredditName
            }
        }
        }

        else if(session?.user){
            let subscribed = await db.subscription.findMany({where: {
                userId: session.user.id
            }})

            let subscribeIds = subscribed.map((elem)=>elem.subbredditId)

            whereClause = {
                subreddit:{
                    id: {
                        in: subscribeIds
                    }
                }
            }

        }

        let posts = await db.post.findMany({
            where: whereClause,
            orderBy:{
            createdAt: 'desc'
        }, take:parseInt(limit), skip: (parseInt(page)-1)*parseInt(limit), 
        include: {
            votes: true,
            author: true,
            comments: true,
            subreddit: true
        }
        })
        return new Response(JSON.stringify(posts))
    }
    catch(err){
        if(err instanceof z.ZodError){
            return new Response("Bad Request", {status: 422})
        }
        return new Response("Couldn't fetch posts", {status: 500})

    }
}