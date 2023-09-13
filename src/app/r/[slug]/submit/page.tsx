import Editor from "@/components/Editor"
import { Button } from "@/components/ui/Button"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"


const Page = async({params}: {params:{slug: string}})=>{

    let {slug} = params
    let decoded = decodeURIComponent(slug)

    const subreddit = await db.subreddit.findFirst({
        where: {
            name: decoded
        }
    })

    if(!subreddit){ return notFound()}

    return(
        <div className="flex flex-col items-start gap-6">
            <div className="border-b border-gray-200 pb-5">
                <div className="-m-1 -mt-2 flex flex-wrap items-baseline">
                    <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
                        Create
                    </h3>
                    <p className="ml-2 mt-1 truncate text-sm text-gray-500">
                        in r/{decoded}
                    </p>
                </div>
            </div>

            <Editor subredditId={subreddit.id} />

            <div className="w-full flex justify-end">
                <Button type='submit' className="w-full" form="subreddit-edit-form">
                    Post
                </Button>
            </div>
        </div>
    )
}

export default Page