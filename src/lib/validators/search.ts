import { z } from "zod";

export const SearchValidator = z.object({
    query: z.string()
})

export type SearchType = z.infer<typeof SearchValidator>
