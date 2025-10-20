import type { UploadedFileMetadata } from '../../../infra/controllers/http/products/types/requests'
import type { SearchResponse } from '../../../infra/controllers/http/search/types/responses'
import type { LoggerRepository } from '../../repositories/logger/repository'
import type { InsertService } from '../../services/insert/service'
import type { ReadFileService } from '../../services/readFile/service'
import type { SearchService } from '../../services/search/service'

interface ECommerceUsecaseDeps {
  logger: LoggerRepository
  readFileService: ReadFileService
  insertService: InsertService
  searchService: SearchService
}
export interface ECommerceUsecase {
  insertProducts: (uploadedFilesMetadata: UploadedFileMetadata[]) => Promise<boolean | Error>
  searchProducts: (query: string) => Promise<SearchResponse | Error>
}

export const make = (deps: ECommerceUsecaseDeps): ECommerceUsecase => {
  const { logger, readFileService, insertService, searchService } = deps

  const insertProducts = async (uploadedFilesMetadata: UploadedFileMetadata[]): Promise<boolean | Error> => {
    try {
      // read uploaded files
      const dataToInsert = readFileService.readFiles(uploadedFilesMetadata)
      // handle response
      if (dataToInsert instanceof Error) {
        logger.error('Error reading files')
        return dataToInsert
      }
      // try to insert data in elastic
      return await insertService.insertData(dataToInsert)
    } catch (error) {
      // handle error
      logger.error(error)
      return new Error('Error inserting products')
    }
  }

  const searchProducts = (query: string): Promise<SearchResponse | Error> => {
    return searchService.search(query)
  }

  return {
    insertProducts,
    searchProducts
  }
}
