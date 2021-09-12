import { LinkedinUser } from 'src/linkedin-user/linkedinUser.entity';
import { ILIUserState } from 'src/linkedin-user/types';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import Flow from './flow.entity';
import { MinMax } from './min-max';
import { Node } from './node.entity';

@Entity()
export default class InmailNode extends Node {
  @Column({ default: '' })
  title: string;

  @Column({ default: '' })
  message: string;

  @Column({ default: 'Follow Up' })
  state: ILIUserState;

  @Column(() => MinMax)
  next_profile: MinMax;

  @Column(() => MinMax)
  click_message: MinMax;

  @Column(() => MinMax)
  insert_title: MinMax;

  @Column(() => MinMax)
  insert_message: MinMax;

  @Column(() => MinMax)
  click_send: MinMax;

  @ManyToOne(() => Flow, (flow) => flow.inmail_nodes)
  flow: Flow;

  @ManyToMany(() => LinkedinUser, (users) => users.inmail_success)
  @JoinTable()
  success_users: LinkedinUser[];

  success_users_count: number;

  @ManyToMany(() => LinkedinUser, (users) => users.inmail_failed)
  @JoinTable()
  failed_users: LinkedinUser[];

  failed_users_count: number;
}
