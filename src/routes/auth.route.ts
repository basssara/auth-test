import { Router } from 'express'
import { refreshToken, signUp, singIn, logout } from '../controller'
import authMiddleware from '../middlewares/auth.middleware'
import { checkSignInFields, checkSignUpFields } from '../middlewares/check-fields'

const routes = Router()

routes.post('/signin', checkSignInFields, singIn)
routes.post('/signin/new-token/:id', refreshToken)
routes.post('/signup', checkSignUpFields, signUp)
routes.get('/logout', authMiddleware, logout)

export { routes as authRoutes }
