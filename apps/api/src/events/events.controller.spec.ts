import { ConflictException } from '@nestjs/common';
import type { SubmitFeedbackInput } from './dto/submit-feedback.input';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { SIMULATION_FEEDBACK_FIXTURES } from './fixtures/simulation-feedback.fixtures';

describe('EventsController', () => {
  let controller: EventsController;
  let eventsService: Pick<EventsService, 'submitFeedback'>;

  beforeEach(() => {
    jest.useFakeTimers();
    eventsService = { submitFeedback: jest.fn().mockResolvedValue(undefined) };
    controller = new EventsController(eventsService as EventsService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('returns 202-style acceptance immediately without waiting for submissions', () => {
    const result = controller.simulate();

    expect(result).toEqual({ scheduled: SIMULATION_FEEDBACK_FIXTURES.length });
    expect(eventsService.submitFeedback).not.toHaveBeenCalled();
  });

  it('submits every fixture exactly once with delays between 500ms and 5000ms', async () => {
    const setTimeoutSpy = jest.spyOn(globalThis, 'setTimeout');

    controller.simulate();
    await jest.runAllTimersAsync();

    expect(eventsService.submitFeedback).toHaveBeenCalledTimes(
      SIMULATION_FEEDBACK_FIXTURES.length,
    );

    const delays = setTimeoutSpy.mock.calls.map(
      ([, delayMs]) => delayMs as number,
    );
    expect(delays).toHaveLength(SIMULATION_FEEDBACK_FIXTURES.length);
    for (const delayMs of delays) {
      expect(delayMs).toBeGreaterThanOrEqual(500);
      expect(delayMs).toBeLessThanOrEqual(5000);
    }
  });

  it('submits a randomly shuffled copy of the fixtures rather than mutating the original order', async () => {
    controller.simulate();
    await jest.runAllTimersAsync();

    const submittedIds = (
      eventsService.submitFeedback as jest.Mock
    ).mock.calls.map(([input]: [SubmitFeedbackInput]) => input.eventId);
    expect(submittedIds.sort()).toEqual(
      SIMULATION_FEEDBACK_FIXTURES.map((f) => f.eventId).sort(),
    );
  });

  it('rejects a second simulation while one is already running', async () => {
    controller.simulate();

    expect(() => controller.simulate()).toThrow(ConflictException);

    await jest.runAllTimersAsync();
  });

  it('allows a new simulation to start once the previous one has finished', async () => {
    controller.simulate();
    await jest.runAllTimersAsync();

    expect(() => controller.simulate()).not.toThrow();
    await jest.runAllTimersAsync();

    expect(eventsService.submitFeedback).toHaveBeenCalledTimes(
      2 * SIMULATION_FEEDBACK_FIXTURES.length,
    );
  });

  it('continues submitting remaining fixtures after an individual submission fails', async () => {
    (eventsService.submitFeedback as jest.Mock)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('event not found'))
      .mockResolvedValue(undefined);

    controller.simulate();
    await jest.runAllTimersAsync();

    expect(eventsService.submitFeedback).toHaveBeenCalledTimes(
      SIMULATION_FEEDBACK_FIXTURES.length,
    );
  });
});
