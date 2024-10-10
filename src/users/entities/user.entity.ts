import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ nullable: true, unique: true })
  username: string;

  @Column()
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  phone: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}