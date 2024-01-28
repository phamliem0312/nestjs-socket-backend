import { Column, Entity } from 'typeorm';

@Entity()
export class ModelEntity {
  @Column({ unique: true, name: 'code' })
  code: string;
  [key: string]: any;
}
