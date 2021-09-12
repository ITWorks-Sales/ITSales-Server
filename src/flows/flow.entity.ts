import { LinkedinProfile } from 'src/linkedin-profile/linkedinProfile.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Edge from './edge.entity';
import InmailNode from './inmailNode.entity';
import QueueNode from './queueNode.entity';

@Entity()
export default class Flow {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'real' })
  view_x: number;

  @Column({ type: 'real' })
  view_y: number;

  @Column({ type: 'real' })
  zoom: number;

  @OneToMany(() => Edge, (edge) => edge.flow)
  edges: Edge[];

  @OneToMany(() => InmailNode, (node) => node.flow)
  inmail_nodes: InmailNode[];

  @OneToMany(() => QueueNode, (node) => node.flow)
  queue_nodes: QueueNode[];

  @ManyToOne(() => LinkedinProfile, (profile) => profile.flows)
  linkedin_profile: LinkedinProfile;
}
