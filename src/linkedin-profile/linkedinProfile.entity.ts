import Flow from 'src/flows/flow.entity';
import { MessageHistory } from 'src/message-history/messageHistory.entity';
import { Template } from 'src/templates/template.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
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

  @OneToMany(
    () => MessageHistory,
    (message_history) => message_history.linekdin_profile,
  )
  message_histories: MessageHistory[];

  @OneToMany(() => Template, (template) => template.linkedin_profile)
  templates: Template[];

  @OneToMany(() => Flow, (flow) => flow.linkedin_profile)
  flows: Flow[];
}
