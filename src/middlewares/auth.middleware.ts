import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { myDataSource } from '../utils'
import { TokensBlackListEntity } from '../entities'

export default async (req: Request, res: Response, next: NextFunction) => {
  const { method } = req
  if (method === 'OPTIONS') {
    return next()
  }
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized!' })
    }

    const terminated = await myDataSource.getRepository(TokensBlackListEntity).findOne({ where: { userToken: token } })

    if (terminated) {
      return res.status(401).json({ message: 'Token terminated' })
    }

    const mustBeDeleted = await myDataSource.getRepository(TokensBlackListEntity).find()

    for (const deleted of mustBeDeleted) {
      const timeExp = deleted.exp.getTime()

      if (timeExp < new Date().getTime() * 1000) {
        await myDataSource.getRepository(TokensBlackListEntity).delete({ id: deleted.id })
      }
    }

    jwt.verify(token, `${process.env.SECRET_KEY}`, async (err, decoded) => {
      if (err) {
        res.status(404).json({ status: 'fail', message: 'Token lifetime Expired!' })
      } else {
        res.locals.jwt = decoded

        next()
      }
    })
  } catch (e) {
    console.error(e)
    return res.status(401)
  }
}
