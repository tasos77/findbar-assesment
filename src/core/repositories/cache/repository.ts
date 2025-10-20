import type { SearchResponse } from '../../../infra/controllers/http/search/types/responses'

export interface CacheRepository {
  set: (key: string, value: SearchResponse) => void
  get: (key: string) => SearchResponse | undefined
}
