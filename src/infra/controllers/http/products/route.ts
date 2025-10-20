import type { Request, Response } from 'express'
import { Router } from 'express'
import fs from 'fs'
import multer from 'multer'
import path from 'path'
import type { LoggerRepository } from '../../../../core/repositories/logger/repository'
import type { ECommerceUsecase } from '../../../../core/usecases/e-commerce/usecase'
import type { UploadedFileMetadata } from './types/requests'

interface ProductRouteDeps {
  logger: LoggerRepository
  ecommerceUsecase: ECommerceUsecase
}

export const make = (deps: ProductRouteDeps): Router => {
  const { logger, ecommerceUsecase } = deps
  const router: Router = Router()

  // set folder path for uploads
  const uploadsPath = './uploads/'

  // try to create uploads folder if it doesn't exist
  try {
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true })
      logger.info('Uploads directory created')
    }
  } catch (error) {
    logger.error(`Failed to create uploads directory, reason: ${(error as Error).message}`)
    throw new Error(`Failed to create uploads directory`)
  }

  // setup disk storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsPath)
    },
    filename: (req, file, cb) => {
      cb(
        null,
        // construct filename, get file extension safely
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      )
    }
  })

  // init multer middleware and add file format validation logic
  // (alternative , use inmemory storage storage: multer.memoryStorage())
  const multiUpload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.originalname.split('.')[1] !== 'json') {
        const err = new Error('Only .json file format allowed!')
        err.name = 'FileFormatError'
        return cb(err)
      }
      cb(null, true)
    }
  }).array('products')

  // make router
  router.post('/products', async (req: Request, res: Response) => {
    // use multer middleware, and handle errors if any
    multiUpload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: `Error uploading file, reason: ${err.message}` })
      } else if (err && err.name === 'FileFormatError') {
        return res.status(400).json({ error: `Invalid file type, reason: ${err.message}` })
      } else if (err) {
        return res.status(500).json({ error: `Server error, reason: ${err.message}` })
      }

      // pass uploaded files metadata to usecase
      const result = await ecommerceUsecase.insertProducts(req.files as UploadedFileMetadata[])
      // handle response
      if (result instanceof Error) {
        return res.status(500).json({ error: `Failed to upload products, reason: ${result}` })
      }
      return res.status(200).end('Data uploaded successfully.')
    })
  })
  return router
}
