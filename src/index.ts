import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import cors from 'cors'
import 'reflect-metadata'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import { myDataSource } from './utils'
import { authRoutes, fileRoutes, infoRoutes } from './routes'

const app = express()
const port = process.env.PORT || 3003

app.use(cors())
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})
app.use(express.json())
app.use(
  session({
    secret: process.env.SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  }),
)
app.use(cookieParser())
app.use(express.static('uploads'))

/**
 * APIs
 */
app.use('/api', authRoutes)
app.use('/api', fileRoutes)
app.use('/api', infoRoutes)

async function start() {
  try {
    myDataSource
      .initialize()
      .then(() => {
        console.log('Data Source has been initialized!')
      })
      .catch((err) => {
        console.error('Error during Data Source initialization:', err)
      })

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`)
    })
  } catch (err: unknown) {
    console.error(err)
  }
}

start()
