import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { MessageHistory } from './messageHistory.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => MessageHistory,
    (message_history) => message_history.messages,
    {
      orphanedRowAction: 'delete',
      onDelete: 'CASCADE',
    },
  )
  message_history: MessageHistory;

  @Column()
  is_user_message_author: boolean;

  @Column()
  message_content: string;

  @Column()
  time: string;

  @Column('text', { array: true })
  attachments: string[];
}
