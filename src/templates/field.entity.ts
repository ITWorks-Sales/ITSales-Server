import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Template } from './template.entity';
import { fieldType } from './types';

@Entity()
export class Field {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Template, (template) => template.fields)
  template: Template;

  @Column({ default: '' })
  key: string;

  @Column({ default: '' })
  value: string;

  @Column({ default: 'string' })
  type: fieldType;
}
