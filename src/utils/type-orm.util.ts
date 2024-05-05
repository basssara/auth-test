import { DataSource } from 'typeorm'
import { User, File, TokensBlackListEntity } from '../entities'

export const myDataSource = new DataSource({
  type: 'mysql',
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  entities: [User, File, TokensBlackListEntity],
  logging: true,
  synchronize: true,
})
