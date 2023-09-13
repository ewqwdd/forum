import axios from "axios"

export async function GET(req: Request){
    let url = new URL(req.url)
    const href = url.searchParams.get('url')
    if(!href){
        return new Response('Link is empty', {status: 400})
    }

    const res = await axios.get(href)

    let titleMatch = res.data.match(/<title>(.*?)<\/title>/)
    let title = titleMatch ? titleMatch[1] : ''

    let metaMatch = res.data.match(/<meta name="description" content=">(.*?)"/)
    let description = metaMatch ? metaMatch[1] : ''

    let imageMatch = res.data.match(/<meta property="og:image" content="(.*?)"/)
    let imageURL = imageMatch ? imageMatch[1] : ''
    
    return new Response(JSON.stringify({
        success: 1,
        meta:{
            title,
            description,
            image: {
                url: imageURL
            }
        }
    }))
}