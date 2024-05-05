import { Request, Response } from 'express'
import { myDataSource } from '../utils'
import { User } from '../entities'

export async function userInfo(req: Request, res: Response) {
  const { jwt } = res.locals
  console.log(jwt)
  const user = await myDataSource.getRepository(User).findOne({ where: { id_outer: jwt.email } })

  res.status(200).json({ userId: user?.id_outer, status: 'ok' })
}
