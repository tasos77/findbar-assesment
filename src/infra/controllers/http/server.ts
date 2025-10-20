import express, { type Express } from 'express'
import type { LoggerRepository } from '../../../core/repositories/logger/repository'

// make server
export const make = () => {
  const server: Express = express()
  return server
}

// start server based on given config
export const start = (server: Express, port: number = 3000, logger: LoggerRepository): void => {
  server.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
  })
}
