import { LRUCache } from 'lru-cache'
import type { CacheRepository } from '../../../core/repositories/cache/repository'
import type { LoggerRepository } from '../../../core/repositories/logger/repository'
import type { SearchResponse } from '../../controllers/http/search/types/responses'

interface CacheRepositoryDeps {
  logger: LoggerRepository
}

export const make = (deps: CacheRepositoryDeps): CacheRepository => {
  const { logger } = deps

  // create cache
  const cache: Map<string, SearchResponse> = new LRUCache({
    max: 10,
    ttl: 1000 * 60 * 60
  })

  // set value in cache
  const set = (key: string, value: SearchResponse) => {
    cache.set(key, value)
    logger.info(`Cache set: ${key}`)
  }

  // get value from cache
  const get = (query: string): SearchResponse | undefined => {
    const cached = cache.get(query)
    if (!cached) {
      logger.info(`Cache miss: ${query}`)
      return cached
    }
    logger.info(`Cache hit: ${query}`)
    return cached
  }

  return {
    set,
    get
  }
}
