import { z } from 'zod'

const UploadedFileMetadataSchema = z.object({
  filename: z.string(),
  path: z.string()
})

export type UploadedFileMetadata = z.infer<typeof UploadedFileMetadataSchema>
