import type { DataToInsert } from '../../entities/dataToInsert/entity'
import type { ElasticSearchRepository } from '../../repositories/elasticSearch/repository'

interface InsertServiceDeps {
  elasticSearchRepo: ElasticSearchRepository
}

export interface InsertService {
  insertData: (dataToInstert: DataToInsert) => Promise<boolean | Error>
}

export const make = (deps: InsertServiceDeps): InsertService => {
  const { elasticSearchRepo } = deps

  const insertData = async (dataToInsert: DataToInsert): Promise<boolean | Error> => {
    return await elasticSearchRepo.bulkInsertion(dataToInsert)
  }

  return {
    insertData
  }
}
