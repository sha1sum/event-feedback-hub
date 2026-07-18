import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  ArrayUnique,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class FeedbackSubscriptionFilterInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  eventId?: string;

  @Field(() => [Int], { nullable: true })
  @IsOptional()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Max(5, { each: true })
  ratings?: number[];
}
