import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Event } from './event.entity';

@ObjectType()
@Entity({ name: 'feedback' })
@Check(`"rating" BETWEEN 1 AND 5`)
@Check(`length(trim("description")) > 0`)
@Index(['createdAt'])
@Index(['eventId', 'createdAt'])
@Index(['eventId', 'rating', 'createdAt'])
@Index(['rating', 'createdAt'])
export class Feedback {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field(() => ID)
  @Column({ type: 'varchar' })
  eventId!: string;

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.feedback, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'eventId' })
  event!: Event;

  @Field(() => String)
  get eventName(): string {
    return this.event?.name ?? '';
  }

  @Field(() => String)
  @Column({ type: 'text' })
  submitterName!: string;

  @Field(() => Int)
  @Column({ type: 'integer' })
  rating!: number;

  @Field(() => String)
  @Column({ type: 'text' })
  description!: string;

  @Field(() => Date)
  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
