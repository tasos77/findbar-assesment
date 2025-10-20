import type { Request, Response } from 'express'
import { Router } from 'express'
import type { ECommerceUsecase } from '../../../../core/usecases/e-commerce/usecase'
import { validateRequest } from '../middleware'
import { SearchRequestSchema } from './types/requests'

interface SearchRouterDeps {
  ecommerceUsecase: ECommerceUsecase
}

export const make = (deps: SearchRouterDeps): Router => {
  const { ecommerceUsecase } = deps

  // make search router
  const router: Router = Router()
  router.get('/search', validateRequest('query', SearchRequestSchema), async (req: Request, res: Response) => {
    // get query param
    const { q } = req.query
    // pass param in usecase
    const result = await ecommerceUsecase.searchProducts(q as string)
    // return results or error accordingly
    res.json(result)
  })
  return router
}
