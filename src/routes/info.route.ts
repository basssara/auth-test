import { Router, Request, Response } from 'express'
import { userInfo } from '../controller'
import authMiddleware from '../middlewares/auth.middleware'

const routes = Router()

routes.get('/info', authMiddleware, userInfo)

export { routes as infoRoutes }
