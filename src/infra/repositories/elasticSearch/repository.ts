import type { DataToInsert } from '../../../core/entities/dataToInsert/entity'
import type { ElasticSearchRepository } from '../../../core/repositories/elasticSearch/repository'
import type { LoggerRepository } from '../../../core/repositories/logger/repository'
import type { SearchResponse } from '../../controllers/http/search/types/responses'
import { api } from './api'

interface ElasticSearchRepositoryDeps {
  logger: LoggerRepository
}

export const make = (deps: ElasticSearchRepositoryDeps): ElasticSearchRepository => {
  const { logger } = deps

  const elasticSearchApi = api({ logger })

  const bulkInsertion = async (dataToInsert: DataToInsert): Promise<boolean | Error> => {
    return await elasticSearchApi.bulkInsertion(dataToInsert)
  }

  const search = async (query: string): Promise<SearchResponse | Error> => {
    return await elasticSearchApi.search(query)
  }

  return {
    bulkInsertion,
    search
  }
}
