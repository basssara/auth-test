import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { TokensBlackListEntity, User } from '../entities'
import { myDataSource } from '../utils'
import { UserRequest, UserSignInRequest } from '../interfaces'

export async function singIn(req: Request, res: Response) {
  const data = req.body as UserSignInRequest

  const user = await myDataSource.getRepository(User).findOne({ where: { id_outer: data.id } })

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const comparedPassword = bcrypt.compareSync(data.password, user.password)

  if (!comparedPassword) {
    return res.status(400).json({ message: 'Invalid password' })
  }

  const accessToken = jwt.sign({ id: user.id_outer.toString(), email: user.id_outer }, String(process.env.SECRET_KEY), {
    expiresIn: '10m',
  })

  const refreshToken = jwt.sign(
    { id: user.id_outer.toString(), email: user.id_outer },
    String(process.env.SECRET_KEY),
    {
      expiresIn: '30d',
    },
  )

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  })

  return res.status(200).json({
    status: 'ok',
    message: 'Welcome',
    tokens: { accessToken, refreshToken },
  })
}

export async function signUp(req: Request, res: Response) {
  const data = req.body as UserRequest
  const hashedPassword = await bcrypt.hash(data.password, 7)

  const isExist = await myDataSource.getRepository(User).findOne({ where: { id_outer: data.id } })

  if (isExist) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const user = await myDataSource.getRepository(User).save({ id_outer: data.id, password: hashedPassword })

  const accessToken = jwt.sign({ id: user.id_outer }, String(process.env.SECRET_KEY), {
    expiresIn: '10m',
  })

  const refreshToken = jwt.sign({ id: user.id_outer }, String(process.env.SECRET_KEY), {
    expiresIn: '30d',
  })

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  })

  return res.status(201).json({ message: 'User created', status: 'No content', tokens: { accessToken, refreshToken } })
}

export async function logout(req: Request, res: Response) {
  const token = req.headers.authorization?.split(' ')[1]
  const { jwt } = res.locals

  if (req.session) {
    req.session.destroy(async (err) => {
      await myDataSource.getRepository(TokensBlackListEntity).save({
        userToken: token,
        iat: new Date(jwt.iat * 1000),
        exp: new Date(jwt.exp * 1000),
      })

      if (err) {
        return res.status(400).json({ message: 'Unable to log out' })
      }
      res.status(200).json({ message: 'Logged out' })
      // res.redirect('/signin')
    })
  }
}

export async function refreshToken(req: Request, res: Response) {
  const userId = req.params.id as string
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(403).json({ message: 'Invalid refresh token' })
  }

  try {
    jwt.verify(refreshToken, String(process.env.SECRET_KEY))

    const accessToken = jwt.sign({ username: userId }, String(process.env.SECRET_KEY), {
      expiresIn: '10m',
    })

    return res
      .status(201)
      .json({ message: 'Token refreshed', status: 'No content', tokens: { accessToken, refreshToken } })
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' })
  }

  return res.status(200).json({ message: 'ok' })
}
