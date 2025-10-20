import type { SearchResponse } from '../../../infra/controllers/http/search/types/responses'
import type { CacheRepository } from '../../repositories/cache/repository'
import type { ElasticSearchRepository } from '../../repositories/elasticSearch/repository'

interface SearchServiceDeps {
  elasticSearchRepo: ElasticSearchRepository
  cacheRepo: CacheRepository
}

export interface SearchService {
  search(query: string): Promise<SearchResponse | Error>
}

export const make = (deps: SearchServiceDeps): SearchService => {
  const { elasticSearchRepo, cacheRepo } = deps

  const search = async (query: string): Promise<SearchResponse | Error> => {
    // search for products in cache
    const result = cacheRepo.get(query)
    // search for products in elastic search if cache misses
    if (!result) {
      const result = await elasticSearchRepo.search(query)
      // handle error
      if (result instanceof Error) {
        return result
      }
      // set result in cache then retur
      cacheRepo.set(query, result)
      return result
    }
    // return cached result
    return result
  }

  return {
    search
  }
}
