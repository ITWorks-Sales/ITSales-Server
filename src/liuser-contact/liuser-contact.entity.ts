import { LinkedinUser } from 'src/linkedin-user/linkedinUser.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LIUserContact {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => LinkedinUser, (linkedinUser) => linkedinUser.liUserContact)
  linkedinUser: LinkedinUser;

  @Column('text', { array: true, default: [] })
  email: string[];

  @Column({ default: '' })
  comments: string;

  @Column({ default: '' })
  current_satus: string;

  @Column({ default: '' })
  next_action: string;

  @Column({ type: 'timestamptz', nullable: true })
  last_time_of_contact: Date;

  @Column({ type: 'timestamptz', nullable: true })
  next_time_of_contact: Date;
}
