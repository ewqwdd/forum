import { z } from "zod";

export const GetPostsValidator = z.object({
    subredditName: z.string().nullish().optional(),
    limit: z.string(),
    page: z.string()
})

export type GetPostType = z.infer<typeof GetPostsValidator>