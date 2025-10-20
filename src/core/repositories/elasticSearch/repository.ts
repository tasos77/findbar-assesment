import type { SearchResponse } from '../../../infra/controllers/http/search/types/responses'
import type { DataToInsert } from '../../entities/dataToInsert/entity'

export interface ElasticSearchRepository {
  bulkInsertion: (dataToInsert: DataToInsert) => Promise<boolean | Error>
  search: (query: string) => Promise<SearchResponse | Error>
}
