import {
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { SIMULATION_FEEDBACK_FIXTURES } from './fixtures/simulation-feedback.fixtures';
import { EventsService } from './events.service';

const MIN_DELAY_MS = 500;
const MAX_DELAY_MS = 5_000;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shuffled<T>(items: readonly T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomDelayMs(): number {
  return (
    MIN_DELAY_MS + Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1))
  );
}

/**
 * Unauthenticated demo endpoint that trickles a batch of fixture feedback
 * submissions into the app so evaluators can see the realtime `feedbackAdded`
 * subscription in action without manually submitting dozens of forms.
 *
 * This intentionally bypasses GraphQL auth by calling `EventsService`
 * directly, matching how a real client submission would be persisted and
 * published.
 */
@Controller('api/events')
export class EventsController {
  private readonly logger = new Logger(EventsController.name);
  private isSimulationRunning = false;

  constructor(private readonly eventsService: EventsService) {}

  @Post('simulate')
  @HttpCode(HttpStatus.ACCEPTED)
  simulate(): { scheduled: number } {
    if (this.isSimulationRunning) {
      throw new ConflictException('A simulation is already running.');
    }
    this.isSimulationRunning = true;

    const fixtures = shuffled(SIMULATION_FEEDBACK_FIXTURES);
    void this.runSimulation(fixtures).finally(() => {
      this.isSimulationRunning = false;
    });

    return { scheduled: fixtures.length };
  }

  private async runSimulation(
    fixtures: readonly (typeof SIMULATION_FEEDBACK_FIXTURES)[number][],
  ): Promise<void> {
    for (const fixture of fixtures) {
      await delay(randomDelayMs());
      try {
        await this.eventsService.submitFeedback(fixture);
      } catch (error) {
        const reason = error instanceof Error ? error.message : String(error);
        this.logger.warn(
          `Simulated feedback submission failed for event ${fixture.eventId}: ${reason}`,
        );
      }
    }
  }
}
