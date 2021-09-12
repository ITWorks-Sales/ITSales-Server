import { LinkedinProfile } from 'src/linkedin-profile/linkedinProfile.entity';
import { Message } from 'src/message-history/message.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { LinkedinUser } from '../linkedin-user/linkedinUser.entity';

@Entity()
export class MessageHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => LinkedinUser,
    (linkedin_user) => linkedin_user.message_histories,
    {
      orphanedRowAction: 'delete',
      onDelete: 'CASCADE',
    },
  )
  linkedin_user: LinkedinUser;

  @ManyToOne(
    () => LinkedinProfile,
    (linekdin_profile) => linekdin_profile.message_histories,
    {
      orphanedRowAction: 'delete',
      onDelete: 'CASCADE',
      eager: true,
    },
  )
  linekdin_profile: LinkedinProfile;

  @OneToMany(() => Message, (message) => message.message_history, {
    eager: true,
  })
  messages: Message[];
}
