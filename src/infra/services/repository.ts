import * as fs from 'fs'
import * as path from 'path'
import type { DataToInsert } from '../../core/entities/dataToInsert/entity'
import * as dataToInsertEntity from '../../core/entities/dataToInsert/entity'
import type { LoggerRepository } from '../../core/repositories/logger/repository'
import type { ReadFileService } from '../../core/services/readFile/service'
import type { UploadedFileMetadata } from '../controllers/http/products/types/requests'

interface ReadFileServiceDeps {
  logger: LoggerRepository
}

export const make = (deps: ReadFileServiceDeps): ReadFileService => {
  const { logger } = deps
  // read all files that are uploaded and valid
  const readFiles = (uploadedFilesMetadata: UploadedFileMetadata[]) => {
    try {
      const data: DataToInsert = []
      uploadedFilesMetadata.forEach(async (fileMetadata) => {
        // read file and parse data
        const absolutePath = path.resolve(process.cwd(), `./${fileMetadata.path}`)
        const parsedData = JSON.parse(fs.readFileSync(absolutePath, 'utf8'))
        // validate and append data
        data.push.apply(data, dataToInsertEntity.from(parsedData))
      })
      // return data from uploaded files
      return data
    } catch (error) {
      // handle error
      logger.error(`Error reading file, reason: ${error.message}`)
      return new Error(`Failed to read file, reason: ${error.message}`)
    }
  }
  return { readFiles }
}
