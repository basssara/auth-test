import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
import { TokensBlackList } from '../interfaces'

@Entity('tokens_blacklist')
export class TokensBlackListEntity implements TokensBlackList {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_token', type: 'varchar', length: 255 })
  userToken: string

  @Column({ name: 'iat_time', type: 'timestamp' })
  iat: Date

  @Column({ name: 'exp_time', type: 'timestamp' })
  exp: Date

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  createdAt: Date
}
