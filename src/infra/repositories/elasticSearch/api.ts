import { Client } from '@elastic/elasticsearch'
import * as fs from 'fs'
import type { DataToInsert } from '../../../core/entities/dataToInsert/entity'
import type { LoggerRepository } from '../../../core/repositories/logger/repository'
import type { SearchResponse } from '../../controllers/http/search/types/responses'

interface ElasticSearchApiDeps {
  logger: LoggerRepository
}

export interface ElasticSearchClientApi {
  bulkInsertion: (products: DataToInsert) => Promise<boolean | Error>
  search: (query: string) => Promise<SearchResponse | Error>
}

export const api = (deps: ElasticSearchApiDeps): ElasticSearchClientApi => {
  const { logger } = deps

  // init client
  const client = new Client({
    tls: {
      ca: fs.readFileSync('./http_ca.crt'),
      rejectUnauthorized: false
    },
    node: 'https://localhost:9200',
    auth: {
      username: 'elastic',
      password: 'changeme'
    }
  })

  // insert products (used for seeding)
  const bulkInsertion = async (products: DataToInsert): Promise<boolean | Error> => {
    // construct request body (update any existing product)
    const body = products.flatMap((product) => [
      { update: { _index: 'products', _id: product.id } },
      { doc: product, doc_as_upsert: true }
    ])
    // bulk insert
    const bulkResponse = await client.bulk({ refresh: true, body })
    // handle response
    if (bulkResponse.errors) {
      logger.warn(`Failed to insert some products, reason: ${bulkResponse.errors}`)
      return new Error(`Failed to insert some products, reason: ${bulkResponse.errors}`)
    }
    logger.info('Bulk insertion success')
    return true
  }

  // search for products
  const search = async (query: string) => {
    try {
      const results = await client.search({
        index: 'products',
        query: {
          multi_match: {
            query, // search for the query string
            fields: ['name', 'description'], // search in name and description fields
            fuzziness: 'AUTO', // allow fuzzy matching
            prefix_length: 1 // first 1 character must match exactly
          } // sort by score it's default
        }
      })

      logger.info('Search success')
      return results.hits.hits.map((hit: any) => ({
        score: hit._score,
        title: hit._source?.name
      }))
    } catch (error) {
      logger.warn(`Failed to search products, reason: ${(error as Error).message}`)
      return new Error(`Failed to search products, reason: ${(error as Error).message}`)
    }
  }

  return {
    bulkInsertion,
    search
  }
}
