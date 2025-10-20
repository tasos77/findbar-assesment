import type { LoggerRepository } from '../../core/repositories/logger/repository'

export const make = (): LoggerRepository => {
  return {
    info: (message: string) => console.log(`[API INFO]: ${message}`),
    warn: (message: string) => console.warn(`[API WARN]: ${message}`),
    error: (message: string) => console.error(`[API ERROR]: ${message}`)
  }
}
