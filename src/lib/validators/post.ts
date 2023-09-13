import {z} from "zod"

export let PostValidator = z.object({
    title: z.string()
    .min(3, {message: "Title must be longer than 3 characters"})
    .max(128, {message: "Title must be no longer than 128 characters"}),
    subredditId: z.string(),
    content: z.any()
})

export type PostType = z.infer<typeof PostValidator>