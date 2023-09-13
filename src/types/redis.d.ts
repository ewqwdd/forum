import { VoteType } from "@prisma/client"


export type CachedPost = {
    id: string
    title: string
    authorUsername: string | null
    content: string
    createdAt: Date
}