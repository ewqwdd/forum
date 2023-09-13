import { db } from "@/lib/db"
import { SearchValidator } from "@/lib/validators/search"

export async function GET(req: Request){
    let url = new URL(req.url)
    let {query} = SearchValidator.parse({
        query: url.searchParams.get('query')
    })

    if(!query){
        return new Response('Invalid query', {status: 422})
    }

    const results = await db.subreddit.findMany({
        where:{
            name: {
                contains: query
            }
        },
        include:{
            _count: true
        },
        take: 5
    })

    return new Response(JSON.stringify(results))
}