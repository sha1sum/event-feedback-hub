import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Feedback } from './entities/feedback.entity';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';
import { pubSubProvider } from './pubsub.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Feedback])],
  providers: [EventsService, EventsResolver, pubSubProvider],
})
export class EventsModule {}
