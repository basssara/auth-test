import { Request, Response, NextFunction } from 'express'
import { UserRequest, UserSignInRequest } from '../interfaces'

export function checkSignUpFields(req: Request, res: Response, next: NextFunction) {
  const { id, password } = req.body as UserRequest

  switch (true) {
    case !id:
      return res.status(400).send('Id is required')
    case !password:
      return res.status(400).send('Password is required')
    default:
      next()
  }
}

export function checkSignInFields(req: Request, res: Response, next: NextFunction) {
  const { id, password } = req.body as UserSignInRequest

  switch (true) {
    case !id:
      return res.status(400).send('Id is required')
    case !password:
      return res.status(400).send('Password is required')
  }

  if (typeof id !== 'string') {
    return res.status(400).send('Id type is incorrect')
  } else if (typeof password !== 'string') {
    return res.status(400).send('Password type is incorrect')
  }

  next()
}
