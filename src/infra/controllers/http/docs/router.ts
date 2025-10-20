import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from './openapi.json'

export const make = (): Router => {
  // make docs router
  const router: Router = Router()
  router.use('/docs', swaggerUi.serve)
  router.get('/docs', swaggerUi.setup(swaggerDocument))

  return router
}
