import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Seeds the database with the same fixture data used by the web app's
 * placeholder dataset (`apps/web/src/data/placeholder.ts`), so evaluators
 * see populated events/feedback the first time the app boots.
 *
 * The placeholder dataset uses human-readable ids (`evt-1`, `fb-1`, ...),
 * but the `events`/`feedback` tables use generated UUID primary keys, so
 * fixed UUIDs are assigned here and reused consistently across both
 * tables' rows and foreign keys.
 */
export class SeedPlaceholderEventsAndFeedback1784408398543 implements MigrationInterface {
  name = 'SeedPlaceholderEventsAndFeedback1784408398543';

  private readonly eventIds = {
    'evt-1': '5547e859-530d-4138-b83e-e1afa70592ef',
    'evt-2': '84acc707-7ed9-44e1-9dad-ec8a0f256645',
    'evt-3': 'ab61135e-ec8b-4b9a-a000-ed2eaf266aae',
    'evt-4': 'd1886305-aeb9-4b44-a360-1d491f9bc297',
    'evt-5': '158b1d61-72f8-48fe-92fa-ee64007608cb',
  } as const;

  private readonly feedbackIds = {
    'fb-1': '4dfa1d41-7b51-41ee-8571-cc06f4056cd6',
    'fb-2': '7fc9ed0a-1886-4930-9a01-e6dae6572941',
    'fb-3': '32a30b00-dc24-4aaa-ad15-c57493a312c6',
    'fb-4': '1f809c66-e0bf-4da0-b3b1-2a371b22cd35',
    'fb-5': 'ef88460a-4c9e-4819-8178-693401e4ea2b',
    'fb-6': '67c2b6c7-fe6e-4e62-82a2-45f555a06014',
    'fb-7': '6c275892-6db2-49a6-93e4-0c59b008996b',
    'fb-8': '5aeb0e3a-d109-4f97-8fc5-97d0df2a4061',
    'fb-9': '5af863cd-f4d9-4ebc-9167-90c72566ae72',
    'fb-10': '3e8f68ad-42fa-460a-974e-bde361620af9',
    'fb-11': '6e8d85fa-e38e-4483-a04c-f7d8432c826a',
    'fb-12': '3a125cc2-e85f-49f6-b8c3-ded1503049d0',
    'fb-13': 'af6645ff-bc79-41ac-8796-b57611cffaa1',
    'fb-14': 'd1ae71d2-b3e5-4d41-9bfb-2aa67378d617',
    'fb-15': 'f3cec7c5-36be-4f67-9e93-be99f1b8482e',
    'fb-16': '90a2cdda-3d3b-49f0-aeee-f03a266efc6f',
    'fb-17': '0fe6e270-a797-4bd0-a019-879b39aedffe',
    'fb-18': '62e93ff6-8c67-4db4-84df-506a0f5cf08c',
    'fb-19': 'dc023ca0-546c-4928-a2dd-9095d0316637',
    'fb-20': '66252a38-8c66-4a96-925f-618318fb0f4b',
    'fb-21': '19ff7dd5-4b9c-43dc-afe4-f952fc53a8c5',
    'fb-22': 'fe4b55ad-5fcf-486e-9b71-5fb82bcc1e9f',
    'fb-23': '1140d632-d223-404e-bdad-6edb48a7e511',
    'fb-24': '768be1b1-ce96-442f-b69f-629ed209519a',
    'fb-25': 'fc4be363-9534-4ab2-bd20-f5c3a945b111',
    'fb-26': 'f5fa8532-ef79-4b5f-9da4-10f44aeacde2',
    'fb-27': '5ea6ef8b-77e8-4213-a647-5dd22e61c753',
    'fb-28': 'c8cfc6a1-4b6e-4f72-85f2-7f92d9999f5e',
    'fb-29': 'af5e429f-d36b-49a7-9f3d-38276c917d53',
    'fb-30': '86b1004a-3ef9-4d49-93c3-dbba971a9280',
    'fb-31': '68d4a3a3-3973-44ee-a4e8-f9e5edd99044',
    'fb-32': '2c838a48-6886-4a8f-854a-8371b3a64525',
    'fb-33': 'f611087b-1815-42bc-9580-d63bce75638b',
    'fb-34': '981df133-0328-45e7-81ff-16b5c93bd1eb',
    'fb-35': 'c316ebc7-0dad-4390-9c52-54f5f91596b3',
    'fb-36': '3541614f-e5bd-4840-9741-3efdb0194a68',
    'fb-37': 'ffe61c2d-3ae3-4c9a-90bb-883a4b94d6aa',
    'fb-38': '639c3e26-98c6-4289-9379-986dd8e5edf7',
    'fb-39': 'b2e394e8-c1fb-419f-8ac1-fc7dd8299239',
    'fb-40': '2511dfbf-c826-4b46-b85f-ea34094d863d',
    'fb-41': 'fe8af864-6ef7-4a9e-85ff-e31e4fff9a63',
    'fb-42': '843457c3-369f-4ead-b9d7-e649489fa81d',
    'fb-43': 'be2e19b8-9e5a-46d2-af19-bb1b16bcd38c',
    'fb-44': '22af380f-0663-43a8-9dc1-71862d64e853',
    'fb-45': 'a40abf31-3282-4a73-bb3e-201c00a7b891',
    'fb-46': 'ee960919-ddb1-4708-84cd-6edf7ab16b0e',
    'fb-47': '9c32750f-2acc-4d41-a10b-48a41b9cb2c5',
    'fb-48': '7409a141-5abd-4c45-8d2a-f7129995538c',
    'fb-49': '930303fe-1698-4716-8740-c3344510ef7b',
    'fb-50': 'b0044884-2865-4eaa-a676-105fb376f557',
    'fb-51': '36e20599-2b33-497e-9896-18b5ac299fdb',
    'fb-52': 'fcfc4c72-b9bb-42d0-96e2-f27d31715712',
    'fb-53': 'f9c02f58-9962-4fde-ab89-311744f2820f',
    'fb-54': '3d048292-662e-44f6-836d-8d06b5b2c276',
    'fb-55': '73f1d8b7-bda7-4fbc-a87f-5299b93dacb2',
    'fb-56': '75b89bb9-6ad5-4393-9508-19585fb19334',
    'fb-57': 'dfe4a79d-30cb-4c77-90e3-6e25a49c1863',
    'fb-58': '10d3203e-5abd-4634-a279-5c75b52776b9',
    'fb-59': '3bcd93d7-7c4d-4bcf-a3f7-4bf7654e2b78',
    'fb-60': '9035850d-3ff1-4bf8-920c-736c73daf1f1',
  } as const;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const events: {
      id: string;
      name: string;
      date: string;
      location: string;
    }[] = [
      {
        id: this.eventIds['evt-1'],
        name: 'Annual Tech Summit 2026',
        date: '2026-03-14',
        location: 'San Francisco, CA',
      },
      {
        id: this.eventIds['evt-2'],
        name: 'Product Launch: Nova',
        date: '2026-04-02',
        location: 'Austin, TX',
      },
      {
        id: this.eventIds['evt-3'],
        name: 'Design Systems Workshop',
        date: '2026-05-18',
        location: 'Remote',
      },
      {
        id: this.eventIds['evt-4'],
        name: 'Community Meetup: Spring Edition',
        date: '2026-06-05',
        location: 'Chicago, IL',
      },
      {
        id: this.eventIds['evt-5'],
        name: 'Engineering Leadership Retreat',
        date: '2026-07-01',
        location: 'Denver, CO',
      },
    ];

    for (const event of events) {
      await queryRunner.query(
        `INSERT INTO "events" ("id", "name", "date", "location") VALUES (?, ?, ?, ?)`,
        [event.id, event.name, event.date, event.location],
      );
    }

    const feedback: {
      id: string;
      eventId: string;
      submitterName: string;
      rating: number;
      description: string;
      createdAt: string;
    }[] = [
      {
        id: this.feedbackIds['fb-1'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Maria Chen',
        rating: 5,
        description:
          'Fantastic lineup of speakers this year. The keynote on distributed systems alone was worth the trip.',
        createdAt: '2026-03-15T09:24:00Z',
      },
      {
        id: this.feedbackIds['fb-2'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Jordan Patel',
        rating: 4,
        description:
          'Great content overall, though the venue was a bit cramped during the networking session.',
        createdAt: '2026-03-15T14:02:00Z',
      },
      {
        id: this.feedbackIds['fb-3'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Sam Okafor',
        rating: 3,
        description:
          'Solid event, but a few of the breakout rooms had audio issues that were distracting.',
        createdAt: '2026-03-16T11:47:00Z',
      },
      {
        id: this.feedbackIds['fb-4'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Priya Nair',
        rating: 5,
        description:
          'The live demo was seamless and the Q&A afterward answered every question I had. Loved it.',
        createdAt: '2026-04-03T08:15:00Z',
      },
      {
        id: this.feedbackIds['fb-5'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Liam Carter',
        rating: 2,
        description:
          'Interesting product, but the presentation ran long and cut into the scheduled networking time.',
        createdAt: '2026-04-03T13:30:00Z',
      },
      {
        id: this.feedbackIds['fb-6'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Elena Rossi',
        rating: 5,
        description:
          'Hands-on exercises were incredibly useful. I walked away with a component library template I could use immediately.',
        createdAt: '2026-05-19T10:05:00Z',
      },
      {
        id: this.feedbackIds['fb-7'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Noah Kim',
        rating: 4,
        description:
          'Well organized and paced nicely for a remote format. Would have liked more time for the token naming discussion.',
        createdAt: '2026-05-19T16:40:00Z',
      },
      {
        id: this.feedbackIds['fb-8'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Ava Thompson',
        rating: 3,
        description:
          'Nice casual vibe and friendly crowd. Wish there had been more structured lightning talks this time around.',
        createdAt: '2026-06-06T09:12:00Z',
      },
      {
        id: this.feedbackIds['fb-9'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Diego Fernandez',
        rating: 5,
        description:
          'Best meetup I have been to this year. Met three people I am now collaborating with on a side project.',
        createdAt: '2026-06-06T18:55:00Z',
      },
      {
        id: this.feedbackIds['fb-10'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Grace Lindqvist',
        rating: 4,
        description:
          'Great mix of workshops and open discussion. The session on scaling team culture was especially timely for us.',
        createdAt: '2026-07-02T07:48:00Z',
      },
      {
        id: this.feedbackIds['fb-11'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Marcus Webb',
        rating: 1,
        description:
          'Retreat felt disorganized this year. Sessions started late and the agenda changed without much notice.',
        createdAt: '2026-07-02T15:20:00Z',
      },
      {
        id: this.feedbackIds['fb-12'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Hana Suzuki',
        rating: 4,
        description:
          'Really impressive polish on the new release. Excited to see how it evolves after this launch.',
        createdAt: '2026-04-04T11:03:00Z',
      },
      // The entries below quintuple the feedback volume per event (fb-13
      // through fb-60) with generated submitters, ratings, descriptions,
      // and timestamps spread across 2025-07-18 through 2026-07-18.
      {
        id: this.feedbackIds['fb-13'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Zoe Castellano',
        rating: 4,
        description:
          'Really impressed by the networking opportunities and the closing remarks. Already looking forward to next year.',
        createdAt: '2026-05-24T05:40:11Z',
      },
      {
        id: this.feedbackIds['fb-14'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Nikolai Iqbal',
        rating: 3,
        description:
          'Some good, some room to improve regarding the breakout rooms. The same could be said for the venue. Might attend again if the schedule works out.',
        createdAt: '2025-09-26T12:30:09Z',
      },
      {
        id: this.feedbackIds['fb-15'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Isabella Iqbal',
        rating: 2,
        description:
          'Struggled with the sponsor booths, and the panel discussion did not help either. Hoping this improves next time.',
        createdAt: '2025-09-12T09:38:34Z',
      },
      {
        id: this.feedbackIds['fb-16'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Freya Alvarado',
        rating: 2,
        description:
          'Underwhelmed by the seating arrangement, and the venue did not help either. Would think twice before attending again.',
        createdAt: '2026-03-20T00:20:56Z',
      },
      {
        id: this.feedbackIds['fb-17'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Nadia Nakamura',
        rating: 4,
        description:
          'Really impressed by the signage and the audio/visual setup. Already looking forward to next year.',
        createdAt: '2025-11-15T23:16:47Z',
      },
      {
        id: this.feedbackIds['fb-18'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Tobias Okonkwo',
        rating: 3,
        description:
          'Mixed feelings about the venue. The same could be said for the networking opportunities. Might attend again if the schedule works out.',
        createdAt: '2026-03-17T09:06:56Z',
      },
      {
        id: this.feedbackIds['fb-19'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Gabriel Whitaker',
        rating: 1,
        description:
          'Disappointed by the closing remarks, and the venue did not help either. Hoping this improves next time.',
        createdAt: '2026-02-24T22:39:07Z',
      },
      {
        id: this.feedbackIds['fb-20'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Elijah Chen',
        rating: 2,
        description:
          'Frustrated with the venue, and the audio/visual setup did not help either. Hoping this improves next time.',
        createdAt: '2025-11-28T14:20:50Z',
      },
      {
        id: this.feedbackIds['fb-21'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Sienna Marsh',
        rating: 5,
        description:
          'Genuinely appreciated the opening keynote and the swag. Everything felt well thought out.',
        createdAt: '2025-09-10T10:12:30Z',
      },
      {
        id: this.feedbackIds['fb-22'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Olivia Whitfield',
        rating: 5,
        description:
          'Really impressed by the panel discussion and the catering. Exceeded my expectations.',
        createdAt: '2025-10-02T08:32:20Z',
      },
      {
        id: this.feedbackIds['fb-23'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Lucas Beaumont',
        rating: 4,
        description:
          'Loved the schedule and the opening keynote. Recommended it to my whole team.',
        createdAt: '2025-09-15T14:13:24Z',
      },
      {
        id: this.feedbackIds['fb-24'],
        eventId: this.eventIds['evt-1'],
        submitterName: 'Owen Bianchi',
        rating: 3,
        description:
          'Mixed feelings about the check-in process. The same could be said for the panel discussion. Not bad, but not memorable either.',
        createdAt: '2026-03-03T05:04:06Z',
      },
      {
        id: this.feedbackIds['fb-25'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Selena Dubois',
        rating: 3,
        description:
          'Some good, some room to improve regarding the seating arrangement. The same could be said for the Q&A format. Left with mixed impressions overall.',
        createdAt: '2026-02-22T00:38:33Z',
      },
      {
        id: this.feedbackIds['fb-26'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Mason Kessler',
        rating: 3,
        description:
          'There were some concerns about the closing remarks. The same could be said for the speaker lineup. A few tweaks would make a big difference.',
        createdAt: '2026-04-10T01:50:10Z',
      },
      {
        id: this.feedbackIds['fb-27'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Sienna Ferreira',
        rating: 2,
        description:
          'Disappointed by the Wi-Fi, and the closing remarks did not help either. Not what I expected going in.',
        createdAt: '2026-02-05T01:04:57Z',
      },
      {
        id: this.feedbackIds['fb-28'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Henry Dubois',
        rating: 3,
        description:
          'Decent overall, especially the closing remarks. The same could be said for the swag. A few tweaks would make a big difference.',
        createdAt: '2026-02-23T00:06:59Z',
      },
      {
        id: this.feedbackIds['fb-29'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Silas Marchetti',
        rating: 4,
        description:
          'Walked away thrilled about the opening keynote and the speaker lineup. Recommended it to my whole team.',
        createdAt: '2026-03-01T11:56:34Z',
      },
      {
        id: this.feedbackIds['fb-30'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Ines Larsen',
        rating: 4,
        description:
          'Loved the pacing of sessions and the breakout rooms. Recommended it to my whole team.',
        createdAt: '2026-02-26T02:40:14Z',
      },
      {
        id: this.feedbackIds['fb-31'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Victor Marsh',
        rating: 4,
        description:
          'Really impressed by the seating arrangement and the venue. Already looking forward to next year.',
        createdAt: '2026-07-16T23:48:59Z',
      },
      {
        id: this.feedbackIds['fb-32'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Silas Halvorsen',
        rating: 5,
        description:
          'Walked away thrilled about the signage and the panel discussion. Recommended it to my whole team.',
        createdAt: '2026-01-07T11:00:43Z',
      },
      {
        id: this.feedbackIds['fb-33'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Zoe Beaumont',
        rating: 1,
        description:
          'Underwhelmed by the venue, and the seating arrangement did not help either. Feedback aside, the core idea has promise.',
        createdAt: '2026-06-14T20:28:45Z',
      },
      {
        id: this.feedbackIds['fb-34'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Tobias Vance',
        rating: 5,
        description:
          'Genuinely appreciated the audio/visual setup and the venue. Exceeded my expectations.',
        createdAt: '2025-10-25T11:37:16Z',
      },
      {
        id: this.feedbackIds['fb-35'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Esme Bianchi',
        rating: 4,
        description:
          'Delighted with the audio/visual setup and the overall energy. Recommended it to my whole team.',
        createdAt: '2026-02-13T22:12:17Z',
      },
      {
        id: this.feedbackIds['fb-36'],
        eventId: this.eventIds['evt-2'],
        submitterName: 'Maren Iqbal',
        rating: 1,
        description:
          'Let down by the pacing of sessions, and the sponsor booths did not help either. Hoping this improves next time.',
        createdAt: '2026-05-30T23:42:32Z',
      },
      {
        id: this.feedbackIds['fb-37'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Mia Renner',
        rating: 1,
        description:
          'Underwhelmed by the venue, and the swag did not help either. Feedback aside, the core idea has promise.',
        createdAt: '2025-11-03T14:58:14Z',
      },
      {
        id: this.feedbackIds['fb-38'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Petra Abara',
        rating: 3,
        description:
          'Some good, some room to improve regarding the schedule. The same could be said for the closing remarks. A few tweaks would make a big difference.',
        createdAt: '2026-06-16T05:07:42Z',
      },
      {
        id: this.feedbackIds['fb-39'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Noah Dubois',
        rating: 5,
        description:
          'Big fan of the overall energy and the networking opportunities. Exceeded my expectations.',
        createdAt: '2026-07-10T20:25:20Z',
      },
      {
        id: this.feedbackIds['fb-40'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Cleo Petrova',
        rating: 4,
        description:
          'Loved the venue and the seating arrangement. Everything felt well thought out.',
        createdAt: '2025-09-20T06:10:16Z',
      },
      {
        id: this.feedbackIds['fb-41'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Sofia Okonkwo',
        rating: 3,
        description:
          'There were some concerns about the Q&A format. The same could be said for the speaker lineup. A few tweaks would make a big difference.',
        createdAt: '2025-12-08T06:11:50Z',
      },
      {
        id: this.feedbackIds['fb-42'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Zoe Sundberg',
        rating: 4,
        description:
          'Thoroughly enjoyed the networking opportunities and the breakout rooms. Exceeded my expectations.',
        createdAt: '2026-01-15T11:31:03Z',
      },
      {
        id: this.feedbackIds['fb-43'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Petra Petrova',
        rating: 1,
        description:
          'Underwhelmed by the pacing of sessions, and the sponsor booths did not help either. Left earlier than planned because of it.',
        createdAt: '2025-09-25T21:48:16Z',
      },
      {
        id: this.feedbackIds['fb-44'],
        eventId: this.eventIds['evt-3'],
        submitterName: 'Ethan Farrow',
        rating: 4,
        description:
          'Walked away thrilled about the opening keynote and the seating arrangement. Recommended it to my whole team.',
        createdAt: '2026-05-05T17:35:57Z',
      },
      {
        id: this.feedbackIds['fb-45'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Ines Kowalski',
        rating: 2,
        description:
          'Let down by the catering, and the sponsor booths did not help either. Hoping this improves next time.',
        createdAt: '2026-04-16T00:41:24Z',
      },
      {
        id: this.feedbackIds['fb-46'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Silas Castillo',
        rating: 3,
        description:
          'Some good, some room to improve regarding the check-in process. The same could be said for the pacing of sessions. Left with mixed impressions overall.',
        createdAt: '2026-07-14T17:23:31Z',
      },
      {
        id: this.feedbackIds['fb-47'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Selena Moreno',
        rating: 3,
        description:
          'Mixed feelings about the Q&A format. The same could be said for the breakout rooms. A few tweaks would make a big difference.',
        createdAt: '2026-01-06T05:32:33Z',
      },
      {
        id: this.feedbackIds['fb-48'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Julian Nolan',
        rating: 5,
        description:
          'Loved the swag and the seating arrangement. Exceeded my expectations.',
        createdAt: '2025-09-13T04:50:08Z',
      },
      {
        id: this.feedbackIds['fb-49'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Roman Barros',
        rating: 2,
        description:
          'Let down by the signage, and the opening keynote did not help either. Feedback aside, the core idea has promise.',
        createdAt: '2025-11-20T03:48:34Z',
      },
      {
        id: this.feedbackIds['fb-50'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Amara Renner',
        rating: 3,
        description:
          'Middle-of-the-road experience with the breakout rooms. The same could be said for the swag. Might attend again if the schedule works out.',
        createdAt: '2025-11-03T22:52:03Z',
      },
      {
        id: this.feedbackIds['fb-51'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Cyrus Marchetti',
        rating: 3,
        description:
          'Middle-of-the-road experience with the Wi-Fi. The same could be said for the audio/visual setup. Not bad, but not memorable either.',
        createdAt: '2025-08-01T05:40:20Z',
      },
      {
        id: this.feedbackIds['fb-52'],
        eventId: this.eventIds['evt-4'],
        submitterName: 'Selena Whitaker',
        rating: 5,
        description:
          'Delighted with the overall energy and the Q&A format. One of the better events I have been to recently.',
        createdAt: '2026-05-28T20:08:40Z',
      },
      {
        id: this.feedbackIds['fb-53'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Adrian Reyes',
        rating: 3,
        description:
          'Mixed feelings about the seating arrangement. The same could be said for the Q&A format. Not bad, but not memorable either.',
        createdAt: '2026-04-07T23:49:06Z',
      },
      {
        id: this.feedbackIds['fb-54'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Yara Odom',
        rating: 3,
        description:
          'Some good, some room to improve regarding the closing remarks. The same could be said for the audio/visual setup. Left with mixed impressions overall.',
        createdAt: '2025-10-14T21:50:17Z',
      },
      {
        id: this.feedbackIds['fb-55'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Emil Whitaker',
        rating: 5,
        description:
          'Thoroughly enjoyed the Q&A format and the closing remarks. Exceeded my expectations.',
        createdAt: '2025-10-18T09:43:58Z',
      },
      {
        id: this.feedbackIds['fb-56'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Sofia Beaumont',
        rating: 1,
        description:
          'Struggled with the venue, and the swag did not help either. Feedback aside, the core idea has promise.',
        createdAt: '2025-12-19T20:39:20Z',
      },
      {
        id: this.feedbackIds['fb-57'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Isabella Nakamura',
        rating: 2,
        description:
          'Struggled with the sponsor booths, and the Q&A format did not help either. Feedback aside, the core idea has promise.',
        createdAt: '2026-03-27T08:44:20Z',
      },
      {
        id: this.feedbackIds['fb-58'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Tobias Hassan',
        rating: 3,
        description:
          'Middle-of-the-road experience with the pacing of sessions. The same could be said for the audio/visual setup. Left with mixed impressions overall.',
        createdAt: '2026-03-19T06:41:29Z',
      },
      {
        id: this.feedbackIds['fb-59'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Freya Moreno',
        rating: 5,
        description:
          'Walked away thrilled about the pacing of sessions and the sponsor booths. Everything felt well thought out.',
        createdAt: '2026-01-13T05:44:41Z',
      },
      {
        id: this.feedbackIds['fb-60'],
        eventId: this.eventIds['evt-5'],
        submitterName: 'Junia Beaumont',
        rating: 5,
        description:
          'Genuinely appreciated the Q&A format and the panel discussion. Would absolutely attend again.',
        createdAt: '2026-05-29T11:33:43Z',
      },
    ];

    for (const entry of feedback) {
      await queryRunner.query(
        `INSERT INTO "feedback" ("id", "eventId", "submitterName", "rating", "description", "createdAt") VALUES (?, ?, ?, ?, ?, ?)`,
        [
          entry.id,
          entry.eventId,
          entry.submitterName,
          entry.rating,
          entry.description,
          entry.createdAt,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const feedbackIds = Object.values(this.feedbackIds);
    const eventIds = Object.values(this.eventIds);

    await queryRunner.query(
      `DELETE FROM "feedback" WHERE "id" IN (${feedbackIds.map(() => '?').join(', ')})`,
      feedbackIds,
    );
    await queryRunner.query(
      `DELETE FROM "events" WHERE "id" IN (${eventIds.map(() => '?').join(', ')})`,
      eventIds,
    );
  }
}
