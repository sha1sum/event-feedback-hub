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
export class FeedbackFilterInput {
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

  @Field(() => Int, { defaultValue: 0 })
  @IsInt()
  @Min(0)
  offset: number = 0;

  @Field(() => Int, { defaultValue: 20 })
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
