import type { CacheRepository } from './core/repositories/cache/repository'
import type { ElasticSearchRepository } from './core/repositories/elasticSearch/repository'
import type { LoggerRepository } from './core/repositories/logger/repository'
import type { InsertService } from './core/services/insert/service'
import * as inService from './core/services/insert/service'
import type { ReadFileService } from './core/services/readFile/service'
import type { SearchService } from './core/services/search/service'
import * as seService from './core/services/search/service'
import type { ECommerceUsecase } from './core/usecases/e-commerce/usecase'
import * as ecUsecase from './core/usecases/e-commerce/usecase'
import * as dcRoute from './infra/controllers/http/docs/router'
import * as pRoute from './infra/controllers/http/products/route'
import * as sRoute from './infra/controllers/http/search/router'
import * as serverTools from './infra/controllers/http/server'
import * as cRepo from './infra/repositories/cache/repository'
import * as esRepo from './infra/repositories/elasticSearch/repository'
import * as rfService from './infra/services/repository'
import * as loggerMaker from './infra/utils/logger'

// init repos
const logger: LoggerRepository = loggerMaker.make()
const elasticSearchRepo: ElasticSearchRepository = esRepo.make({ logger })
const cacheRepo: CacheRepository = cRepo.make({ logger })

// init services
const readFileService: ReadFileService = rfService.make({ logger })
const insertService: InsertService = inService.make({ elasticSearchRepo })
const searchService: SearchService = seService.make({ elasticSearchRepo, cacheRepo })

// init usecases
const ecommerceUsecase: ECommerceUsecase = ecUsecase.make({
  logger,
  readFileService,
  insertService,
  searchService
})

// init routes
const docsRoute = dcRoute.make()
const searchRoute = sRoute.make({ ecommerceUsecase })
const productRoute = pRoute.make({ logger, ecommerceUsecase })

// init server
const basePath = '/api/v1'
const server = serverTools.make()

server.use(basePath, docsRoute)
server.use(basePath, searchRoute)
server.use(basePath, productRoute)

serverTools.start(server, 3000, logger)
