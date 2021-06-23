import { LinkedinProfile } from 'src/linkedin-profile/linkedinProfile.entity';
import { LIUserContact } from 'src/liuser-contact/liuser-contact.entity';
import { MessageHistory } from 'src/message-history/messageHistory.entity';
import { Tag } from 'src/tags/tags.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { ILIUserState } from './types';

@Entity()
export class LinkedinUser {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(
    () => LIUserContact,
    (liUserContact) => liUserContact.linkedinUser,
    { eager: true, cascade: true },
  )
  @JoinColumn()
  liUserContact: LIUserContact;

  @ManyToMany(() => User, { eager: true })
  @JoinTable()
  users: User[];

  @ManyToMany(() => LinkedinProfile, { eager: true })
  @JoinTable()
  linkedin_profiles: LinkedinProfile[];

  @ManyToMany(() => Tag, { eager: true })
  @JoinTable()
  tags: Tag[];

  @OneToMany(
    () => MessageHistory,
    (message_history) => message_history.linkedin_user,
    { cascade: ['insert'], eager: true },
  )
  message_histories: MessageHistory[];

  @Column({ default: '' })
  notes: string;

  @Column({ default: 'No Action' })
  state: ILIUserState;

  @Column()
  full_name: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  profile_url: string;

  @Column()
  avatar_url: string;

  @Column()
  public_id: string;

  @Column()
  hash_id: string;

  @Column({ default: null })
  member_id: number;

  @Column({ default: '' })
  avatar_id: string;

  @Column({ default: '' })
  headline: string;

  @Column({ default: '' })
  location: string;

  @Column({ default: '' })
  industry: string;

  @Column({ default: '' })
  summary: string;

  @Column({ default: '' })
  birthday: string;

  @Column({ default: false })
  open_profile: boolean;

  @Column({ default: false })
  premium: boolean;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  phone_number: string;

  @Column({ default: '' })
  connected_at: string;

  @Column({ default: '' })
  current_company_name: string;

  @Column({ default: '' })
  current_company_position: string;

  @Column({ default: '' })
  company_name_1: string;

  @Column({ default: '' })
  company_id_1: string;

  @Column({ default: '' })
  company_url_1: string;

  @Column({ default: '' })
  company_website_1: string;

  @Column({ default: '' })
  company_position_1: string;

  @Column({ default: '' })
  company_position_description_1: string;

  @Column({ default: '' })
  company_position_location_1: string;

  @Column({ default: '' })
  company_start_date_1: string;

  @Column({ default: '' })
  company_end_date_1: string;

  @Column({ default: '' })
  company_name_2: string;

  @Column({ default: '' })
  company_id_2: string;

  @Column({ default: '' })
  company_url_2: string;

  @Column({ default: '' })
  company_website_2: string;

  @Column({ default: '' })
  company_position_2: string;

  @Column({ default: '' })
  company_position_description_2: string;

  @Column({ default: '' })
  company_position_location_2: string;

  @Column({ default: '' })
  company_start_date_2: string;

  @Column({ default: '' })
  company_end_date_2: string;

  @Column({ default: '' })
  company_name_3: string;

  @Column({ default: '' })
  company_id_3: string;

  @Column({ default: '' })
  company_url_3: string;

  @Column({ default: '' })
  company_website_3: string;

  @Column({ default: '' })
  company_position_3: string;

  @Column({ default: '' })
  company_position_description_3: string;

  @Column({ default: '' })
  company_position_location_3: string;

  @Column({ default: '' })
  company_start_date_3: string;

  @Column({ default: '' })
  company_end_date_3: string;

  @Column({ default: '' })
  company_name_4: string;

  @Column({ default: '' })
  company_id_4: string;

  @Column({ default: '' })
  company_url_4: string;

  @Column({ default: '' })
  company_website_4: string;

  @Column({ default: '' })
  company_position_4: string;

  @Column({ default: '' })
  company_position_description_4: string;

  @Column({ default: '' })
  company_position_location_4: string;

  @Column({ default: '' })
  company_start_date_4: string;

  @Column({ default: '' })
  company_end_date_4: string;

  @Column({ default: '' })
  company_name_5: string;

  @Column({ default: '' })
  company_id_5: string;

  @Column({ default: '' })
  company_url_5: string;

  @Column({ default: '' })
  company_website_5: string;

  @Column({ default: '' })
  company_position_5: string;

  @Column({ default: '' })
  company_position_description_5: string;

  @Column({ default: '' })
  company_position_location_5: string;

  @Column({ default: '' })
  company_start_date_5: string;

  @Column({ default: '' })
  company_end_date_5: string;

  @Column({ default: '' })
  company_name_6: string;

  @Column({ default: '' })
  company_id_6: string;

  @Column({ default: '' })
  company_url_6: string;

  @Column({ default: '' })
  company_website_6: string;

  @Column({ default: '' })
  company_position_6: string;

  @Column({ default: '' })
  company_position_description_6: string;

  @Column({ default: '' })
  company_position_location_6: string;

  @Column({ default: '' })
  company_start_date_6: string;

  @Column({ default: '' })
  company_end_date_6: string;

  @Column({ default: '' })
  company_name_7: string;

  @Column({ default: '' })
  company_id_7: string;

  @Column({ default: '' })
  company_url_7: string;

  @Column({ default: '' })
  company_website_7: string;

  @Column({ default: '' })
  company_position_7: string;

  @Column({ default: '' })
  company_position_description_7: string;

  @Column({ default: '' })
  company_position_location_7: string;

  @Column({ default: '' })
  company_start_date_7: string;

  @Column({ default: '' })
  company_end_date_7: string;

  @Column({ default: '' })
  company_name_8: string;

  @Column({ default: '' })
  company_id_8: string;

  @Column({ default: '' })
  company_url_8: string;

  @Column({ default: '' })
  company_website_8: string;

  @Column({ default: '' })
  company_position_8: string;

  @Column({ default: '' })
  company_position_description_8: string;

  @Column({ default: '' })
  company_position_location_8: string;

  @Column({ default: '' })
  company_start_date_8: string;

  @Column({ default: '' })
  company_end_date_8: string;

  @Column({ default: '' })
  company_name_9: string;

  @Column({ default: '' })
  company_id_9: string;

  @Column({ default: '' })
  company_url_9: string;

  @Column({ default: '' })
  company_website_9: string;

  @Column({ default: '' })
  company_position_9: string;

  @Column({ default: '' })
  company_position_description_9: string;

  @Column({ default: '' })
  company_position_location_9: string;

  @Column({ default: '' })
  company_start_date_9: string;

  @Column({ default: '' })
  company_end_date_9: string;

  @Column({ default: '' })
  company_name_10: string;

  @Column({ default: '' })
  company_id_10: string;

  @Column({ default: '' })
  company_url_10: string;

  @Column({ default: '' })
  company_website_10: string;

  @Column({ default: '' })
  company_position_10: string;

  @Column({ default: '' })
  company_position_description_10: string;

  @Column({ default: '' })
  company_position_location_10: string;

  @Column({ default: '' })
  company_start_date_10: string;

  @Column({ default: '' })
  company_end_date_10: string;
}
