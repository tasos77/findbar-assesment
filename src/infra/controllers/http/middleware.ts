import type { NextFunction, Request, Response } from 'express'

import { ZodError, type z } from 'zod'

export const validateRequest = (part: string, schema: z.ZodObject) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //try to parse the request part
    try {
      schema.parse(req[part])
      next()
    } catch (error) {
      // handle zod error if parse fails
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: z.core.$ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        // return bad request response
        res.status(400).json({ error: 'Invalid request', details: errorMessages })
      } else {
        // return internal server error response
        res.status(500).json({ error: 'Internal Server Error' })
      }
    }
  }
}
