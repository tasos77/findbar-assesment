import z from 'zod'

const SearchResponseSchema = z.array(
  z.object({
    score: z.number(),
    title: z.string()
  })
)

export type SearchResponse = z.infer<typeof SearchResponseSchema>
