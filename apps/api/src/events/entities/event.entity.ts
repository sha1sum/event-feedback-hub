import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Feedback } from './feedback.entity';

@ObjectType()
@Entity({ name: 'events' })
export class Event {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => String)
  @Index()
  @Column({ type: 'text' })
  name!: string;

  @Field(() => String)
  @Column({ type: 'date' })
  date!: string;

  @Field(() => String)
  @Column({ type: 'text' })
  location!: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Field(() => Date)
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @OneToMany(() => Feedback, (feedback) => feedback.event)
  feedback!: Feedback[];
}
