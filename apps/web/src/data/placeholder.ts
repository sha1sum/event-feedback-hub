export type StarRating = 1 | 2 | 3 | 4 | 5;

export interface EventOption {
  id: string;
  name: string;
  date: string;
  location: string;
}

export interface FeedbackEntry {
  id: string;
  eventId: string;
  eventName: string;
  submitterName: string;
  rating: StarRating;
  text: string;
  submittedAt: string;
}

export const placeholderEvents: EventOption[] = [
  {
    id: 'evt-1',
    name: 'Annual Tech Summit 2026',
    date: '2026-03-14',
    location: 'San Francisco, CA',
  },
  {
    id: 'evt-2',
    name: 'Product Launch: Nova',
    date: '2026-04-02',
    location: 'Austin, TX',
  },
  {
    id: 'evt-3',
    name: 'Design Systems Workshop',
    date: '2026-05-18',
    location: 'Remote',
  },
  {
    id: 'evt-4',
    name: 'Community Meetup: Spring Edition',
    date: '2026-06-05',
    location: 'Chicago, IL',
  },
  {
    id: 'evt-5',
    name: 'Engineering Leadership Retreat',
    date: '2026-07-01',
    location: 'Denver, CO',
  },
];

export const placeholderFeedback: FeedbackEntry[] = [
  {
    id: 'fb-1',
    eventId: 'evt-1',
    eventName: 'Annual Tech Summit 2026',
    submitterName: 'Maria Chen',
    rating: 5,
    text: 'Fantastic lineup of speakers this year. The keynote on distributed systems alone was worth the trip.',
    submittedAt: '2026-03-15T09:24:00Z',
  },
  {
    id: 'fb-2',
    eventId: 'evt-1',
    eventName: 'Annual Tech Summit 2026',
    submitterName: 'Jordan Patel',
    rating: 4,
    text: 'Great content overall, though the venue was a bit cramped during the networking session.',
    submittedAt: '2026-03-15T14:02:00Z',
  },
  {
    id: 'fb-3',
    eventId: 'evt-1',
    eventName: 'Annual Tech Summit 2026',
    submitterName: 'Sam Okafor',
    rating: 3,
    text: 'Solid event, but a few of the breakout rooms had audio issues that were distracting.',
    submittedAt: '2026-03-16T11:47:00Z',
  },
  {
    id: 'fb-4',
    eventId: 'evt-2',
    eventName: 'Product Launch: Nova',
    submitterName: 'Priya Nair',
    rating: 5,
    text: 'The live demo was seamless and the Q&A afterward answered every question I had. Loved it.',
    submittedAt: '2026-04-03T08:15:00Z',
  },
  {
    id: 'fb-5',
    eventId: 'evt-2',
    eventName: 'Product Launch: Nova',
    submitterName: 'Liam Carter',
    rating: 2,
    text: 'Interesting product, but the presentation ran long and cut into the scheduled networking time.',
    submittedAt: '2026-04-03T13:30:00Z',
  },
  {
    id: 'fb-6',
    eventId: 'evt-3',
    eventName: 'Design Systems Workshop',
    submitterName: 'Elena Rossi',
    rating: 5,
    text: 'Hands-on exercises were incredibly useful. I walked away with a component library template I could use immediately.',
    submittedAt: '2026-05-19T10:05:00Z',
  },
  {
    id: 'fb-7',
    eventId: 'evt-3',
    eventName: 'Design Systems Workshop',
    submitterName: 'Noah Kim',
    rating: 4,
    text: 'Well organized and paced nicely for a remote format. Would have liked more time for the token naming discussion.',
    submittedAt: '2026-05-19T16:40:00Z',
  },
  {
    id: 'fb-8',
    eventId: 'evt-4',
    eventName: 'Community Meetup: Spring Edition',
    submitterName: 'Ava Thompson',
    rating: 3,
    text: 'Nice casual vibe and friendly crowd. Wish there had been more structured lightning talks this time around.',
    submittedAt: '2026-06-06T09:12:00Z',
  },
  {
    id: 'fb-9',
    eventId: 'evt-4',
    eventName: 'Community Meetup: Spring Edition',
    submitterName: 'Diego Fernandez',
    rating: 5,
    text: 'Best meetup I have been to this year. Met three people I am now collaborating with on a side project.',
    submittedAt: '2026-06-06T18:55:00Z',
  },
  {
    id: 'fb-10',
    eventId: 'evt-5',
    eventName: 'Engineering Leadership Retreat',
    submitterName: 'Grace Lindqvist',
    rating: 4,
    text: 'Great mix of workshops and open discussion. The session on scaling team culture was especially timely for us.',
    submittedAt: '2026-07-02T07:48:00Z',
  },
  {
    id: 'fb-11',
    eventId: 'evt-5',
    eventName: 'Engineering Leadership Retreat',
    submitterName: 'Marcus Webb',
    rating: 1,
    text: 'Retreat felt disorganized this year. Sessions started late and the agenda changed without much notice.',
    submittedAt: '2026-07-02T15:20:00Z',
  },
  {
    id: 'fb-12',
    eventId: 'evt-2',
    eventName: 'Product Launch: Nova',
    submitterName: 'Hana Suzuki',
    rating: 4,
    text: 'Really impressive polish on the new release. Excited to see how it evolves after this launch.',
    submittedAt: '2026-04-04T11:03:00Z',
  },
];
