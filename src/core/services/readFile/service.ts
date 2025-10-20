import type { UploadedFileMetadata } from '../../../infra/controllers/http/products/types/requests'
import type { DataToInsert } from '../../entities/dataToInsert/entity'

export interface ReadFileService {
  readFiles: (uploadedFilesMetadata: UploadedFileMetadata[]) => DataToInsert | Error
}
