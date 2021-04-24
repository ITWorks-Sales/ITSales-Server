import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LinkedinProfile } from '../linkedin-profile/linkedinProfile.entity';
import { Proxy } from '../proxy/proxy.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  name: string;

  @OneToMany(() => Proxy, (proxy: Proxy) => proxy.user)
  proxies: Proxy[];

  @OneToMany(
    () => LinkedinProfile,
    (liProfile: LinkedinProfile) => liProfile.user,
  )
  linkedin_profiles: LinkedinProfile[];
}

export interface IUser {
  id: number;
  email: string;
  name: string;
}
