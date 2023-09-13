import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import SubscribeToggle from "@/components/SubscribeLeaveToggle"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/Button"

let Layout = async({children, params}: {children: React.ReactNode, params:{slug: string}})=>{

    let {slug} = params
    let parsed = decodeURIComponent(slug)

    const session = await getAuthSession()
    let subreddit = await db.subreddit.findFirst({
        where: {
            name: parsed
        },
        include:{
            posts: {
                include: {
                    votes: true,
                    author: true
                }
            }
        }
    })

    let subscribersNumber = await db.subscription.count({
        where:{
            subreddit:{
                name: parsed
            }
        }
    })

    if(!subreddit){
        return notFound()
    }

    

    const subscription = !session?.user ? undefined : await db.subscription.findFirst({where: {
        subreddit:{
            name: parsed
        },
        user:{
            id: session.user.id
        }
    }})

    const isSubscribed = !!subscription //transforms to boolean

    return(
        <div className="sm:container max-w-7xl mx-auto h-full pt-12">
            <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
                    <div className="flex flex-col col-span-2 space-y-6">{children}</div>


                    <div className="hidden md:block overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
                        <div className="px-6 py-4">
                            <p className="font-semibold py-3">
                                About r/
                            </p>
                        </div>
                        <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Created</dt>
                                <dd className="text-gray-700">
                                    <time dateTime={subreddit.createdAt.toDateString()}>
                                        {format(subreddit.createdAt, 'd MMMM, yyyy')}
                                    </time>
                                </dd>
                            </div>

                            <div className="flex justify-between gap-x-4 py-3">
                                <dt className="text-gray-500">Members</dt>
                                <dd className="text-gray-700">
                                    {subscribersNumber}
                                </dd>
                            </div>
                            {subreddit.creatorId == session?.user.id ?
                            <div className="flex justify-between gap-x-4 py-3">
                                <p className="text-gray-500">You created this community</p>
                            </div>:
                            <SubscribeToggle subredditName={subreddit.name} subredditId={subreddit.id} isSubscribed={isSubscribed} />
                            }
                            <Link 
                            className={buttonVariants({
                                variant: 'outline',
                                className: 'w-full mb-6'
                            })}
                            href={`/r/${slug}/submit`}>
                                Create
                            </Link>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Layout