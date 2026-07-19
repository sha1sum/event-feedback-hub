import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { Event } from './entities/event.entity';
import { Feedback } from './entities/feedback.entity';
import { EventsController } from './events.controller';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';
import { pubSubProvider } from './pubsub.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Feedback])],
  controllers: [EventsController],
  providers: [ClerkAuthGuard, EventsService, EventsResolver, pubSubProvider],
})
export class EventsModule {}
