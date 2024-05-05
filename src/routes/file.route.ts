import { Router } from 'express'
import { fileRead, fileList, fileUpload, fileUpdate, fileDelete, fileDownload } from '../controller'
import { uploadMiddleware } from '../middlewares/upload-file'
import authMiddleware from '../middlewares/auth.middleware'

const routes = Router()

routes.post('/file/upload', authMiddleware, uploadMiddleware, fileUpload)
routes.get('/file/list', authMiddleware, fileList)
routes.delete('/file/delete/:id', authMiddleware, fileDelete)
routes.get('/file/:id', authMiddleware, fileRead)
routes.get('/file/download/:id', authMiddleware, fileDownload)
routes.put('/file/update/:id', authMiddleware, uploadMiddleware, fileUpdate)

export { routes as fileRoutes }
