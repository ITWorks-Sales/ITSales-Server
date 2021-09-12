import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Flow from './flow.entity';

@Entity()
export default class Edge {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  source: string;

  @Column()
  source_handle: string;

  @Column()
  target: string;

  @Column()
  target_handle: string;

  @ManyToOne(() => Flow, (flow) => flow.edges)
  flow: Flow;
}
