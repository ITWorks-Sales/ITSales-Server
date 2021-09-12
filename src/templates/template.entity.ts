import { LinkedinProfile } from 'src/linkedin-profile/linkedinProfile.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field } from './field.entity';
import { templateType } from './types';

@Entity()
export class Template {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Field, (field) => field.template, {
    eager: true,
    cascade: true,
  })
  fields: Field[];

  @Column({ default: 'Inmail' })
  type: templateType;

  @ManyToOne(
    () => LinkedinProfile,
    (linkedinProfile) => linkedinProfile.templates,
  )
  linkedin_profile: LinkedinProfile;

  @ManyToOne(() => User, (user) => user.templates)
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
