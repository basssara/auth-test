import multer from 'multer'
import { Request, Response, NextFunction } from 'express'

export function uploadMiddleware(req: Request, res: Response, next: NextFunction) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + `.${file.mimetype.split('/')[1]}`)
    },
  })

  const upload = multer({ storage: storage }).single('file')

  upload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const err = new Error('Multer error')
      next(err)
    } else if (err) {
      const err = new Error('Server Error')
      next(err)
    }
    next()
  })
}
