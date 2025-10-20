import z from 'zod'

const dataToInsertSchema = z.array(
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string()
  })
)

export type DataToInsert = z.infer<typeof dataToInsertSchema>

export const from = (possibleDataToInsert: any): DataToInsert => {
  try {
    // parse and return input
    return dataToInsertSchema.parse(possibleDataToInsert)
  } catch (error) {
    // throw error
    throw new Error('Invalid data')
  }
}
