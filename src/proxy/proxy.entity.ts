import { User } from 'src/users/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Proxy {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @ManyToOne(() => User, (user) => user.proxies)
  user: User;
}
