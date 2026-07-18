import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Feedback } from '../entities/feedback.entity';

@ObjectType()
export class FeedbackPage {
  @Field(() => [Feedback])
  items!: Feedback[];

  @Field(() => Int)
  totalCount!: number;

  @Field(() => Int)
  offset!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Boolean)
  hasMore!: boolean;
}
