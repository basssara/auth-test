const { Entity, Column, PrimaryGeneratedColumn } = require('typeorm')
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 255 })
  id_outer: string

  @Column({ type: 'varchar', length: 255 })
  password: string
}
