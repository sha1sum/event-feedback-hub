import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsUUID, Matches, Max, Min } from 'class-validator';

const NOT_BLANK_PATTERN = /\S/;

@InputType()
export class SubmitFeedbackInput {
  @Field(() => ID)
  @IsUUID()
  eventId!: string;

  @Field(() => String)
  @Matches(NOT_BLANK_PATTERN, {
    message: 'submitterName must not be blank',
  })
  submitterName!: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @Field(() => String)
  @Matches(NOT_BLANK_PATTERN, {
    message: 'description must not be blank',
  })
  description!: string;
}
