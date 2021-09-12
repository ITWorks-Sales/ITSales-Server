import { LinkedinUser } from 'src/linkedin-user/linkedinUser.entity';
import { Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import Flow from './flow.entity';
import { Node } from './node.entity';

@Entity()
export default class QueueNode extends Node {
  @ManyToMany(() => LinkedinUser, (users) => users.queue_collected)
  @JoinTable()
  collected_users: LinkedinUser[];

  collected_users_count: number;

  @ManyToOne(() => Flow, (flow) => flow.queue_nodes)
  flow: Flow;
}
