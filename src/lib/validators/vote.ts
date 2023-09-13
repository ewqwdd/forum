import { z } from "zod"

export const VotePostValidator = z.object({
    type: z.enum(['UP', 'DOWN']),
    postId: z.string()
})

export type VotePostType = z.infer<typeof VotePostValidator>