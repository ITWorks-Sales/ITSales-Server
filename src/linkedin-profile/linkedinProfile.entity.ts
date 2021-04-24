import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Proxy } from '../proxy/proxy.entity';
import { User } from '../users/user.entity';
@Entity()
export class LinkedinProfile {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.linkedin_profiles)
  user: User;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  name: string;

  @Column({ default: '' })
  linkedin_image: string;

  @Column({ default: false })
  active: boolean;

  @OneToOne(() => Proxy, { eager: true })
  @JoinColumn()
  proxy: Proxy;
}