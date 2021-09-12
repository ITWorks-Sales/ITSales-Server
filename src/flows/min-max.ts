import { Column } from 'typeorm';

export class MinMax {
  @Column({ default: null, nullable: true })
  min: number;

  @Column({ default: null, nullable: true })
  max: number;
}
