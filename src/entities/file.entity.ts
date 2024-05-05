import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm'
import { FileRequest } from '../interfaces'

@Entity()
export class File implements FileRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  originalname: string

  @Column({ type: 'varchar', length: 20 })
  encoding: string

  @Column({ type: 'varchar', length: 30 })
  mimetype: string

  @Column({ type: 'varchar', length: 255 })
  destination: string

  @Column({ type: 'varchar', length: 255 })
  filename: string

  @Column({ type: 'varchar', length: 255 })
  path: string

  @Column({ type: 'int' })
  size: number

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP(6)' })
  uploadedAt: Date
}
