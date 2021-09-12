import { LinkedinProfile } from 'src/linkedin-profile/linkedinProfile.entity';
import { Column, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import Edge from './edge.entity';

export abstract class Node {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'real' })
  position_x: number;

  @Column({ type: 'real' })
  position_y: number;

  @ManyToMany(() => Edge)
  @JoinTable()
  edges: Edge[];

  @ManyToMany(() => LinkedinProfile)
  @JoinTable()
  processed_profile: LinkedinProfile[];
}
