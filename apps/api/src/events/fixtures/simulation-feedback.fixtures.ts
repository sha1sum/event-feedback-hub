import type { SubmitFeedbackInput } from '../dto/submit-feedback.input';

/**
 * Seeded event UUIDs, duplicated here (rather than imported) from
 * `SeedPlaceholderEventsAndFeedback1784408398543` so this fixture set has no
 * runtime dependency on the migration history.
 */
const EVENT_IDS = {
  annualTechSummit: '5547e859-530d-4138-b83e-e1afa70592ef',
  productLaunchNova: '84acc707-7ed9-44e1-9dad-ec8a0f256645',
  designSystemsWorkshop: 'ab61135e-ec8b-4b9a-a000-ed2eaf266aae',
  communityMeetup: 'd1886305-aeb9-4b44-a360-1d491f9bc297',
  engineeringLeadershipRetreat: '158b1d61-72f8-48fe-92fa-ee64007608cb',
} as const;

/**
 * A static set of 50 realistic feedback submissions, randomly distributed
 * across all five seeded events, used to drive the `/api/events/simulate`
 * demo endpoint.
 */
export const SIMULATION_FEEDBACK_FIXTURES: readonly SubmitFeedbackInput[] = [
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Renee Ashford',
    rating: 5,
    description:
      'The keynote on distributed tracing was excellent, and the demo booths were a nice touch this year.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Caleb Osei',
    rating: 4,
    description:
      'Great talks overall, though the wifi in the main hall struggled once the crowd picked up.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Mireille Dupont',
    rating: 3,
    description:
      'Solid content but the schedule felt rushed between sessions with barely any transition time.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Theo Bergstrom',
    rating: 5,
    description:
      'Best summit yet. The hallway conversations alone were worth flying in for.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Priyanka Deshmukh',
    rating: 2,
    description:
      'Registration lines were long and the coffee ran out before most people got any.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Owen Fitzgerald',
    rating: 4,
    description:
      'Loved the panel on platform engineering, would have liked a longer Q&A block though.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Anastasia Volkov',
    rating: 5,
    description:
      'Everything ran on time, the app for the schedule worked flawlessly, and the swag was actually useful.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Marcus Delacroix',
    rating: 3,
    description:
      'Decent event but felt a bit corporate this year compared to previous summits.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Yuki Tanaka',
    rating: 4,
    description:
      'Appreciated the accessibility accommodations and the live captioning on every stage.',
  },
  {
    eventId: EVENT_IDS.annualTechSummit,
    submitterName: 'Bianca Ferreira',
    rating: 5,
    description:
      'The closing fireside chat was a highlight, felt genuinely candid instead of scripted.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Declan O\u2019Malley',
    rating: 5,
    description:
      'The live demo of Nova was seamless, and the roadmap Q&A answered every question I had.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Farida Haidari',
    rating: 4,
    description:
      'Impressive launch, though the pricing slide went by too fast for anyone to actually read it.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Gustav Lindqvist',
    rating: 2,
    description:
      'Presentation ran long and cut almost all of the promised networking time at the end.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Camille Rousseau',
    rating: 5,
    description:
      'Genuinely excited about this release. The onboarding walkthrough sold me immediately.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Hassan Al-Amin',
    rating: 3,
    description:
      'Product looks promising, but the launch event itself felt more like a sales pitch than a workshop.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Ingrid Solberg',
    rating: 4,
    description:
      'Nice polish on the new dashboard. Curious to see how the migration path plays out for existing users.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Julien Marchand',
    rating: 5,
    description:
      'The behind-the-scenes engineering story made this launch feel a lot more credible than most.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Keiko Yamamoto',
    rating: 1,
    description:
      'Stream kept dropping for remote attendees and there was no fallback recording offered afterward.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Lorenzo Bianchi',
    rating: 4,
    description:
      'Solid launch event with a clear narrative. The customer testimonial segment landed well.',
  },
  {
    eventId: EVENT_IDS.productLaunchNova,
    submitterName: 'Marguerite Laurent',
    rating: 3,
    description:
      'A bit heavy on marketing language, but the actual product improvements are meaningful.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Nasrin Karimi',
    rating: 5,
    description:
      'The hands-on exercises were fantastic. I left with a token pipeline I can actually adopt on Monday.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Otis Bramwell',
    rating: 4,
    description:
      'Well paced for a remote format, though I wanted more time on the component versioning discussion.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Paloma Vega',
    rating: 5,
    description:
      'Loved the live critique of real design systems from the audience. Very actionable feedback loop.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Quentin Aubry',
    rating: 3,
    description:
      'Good material but the breakout groups were uneven in size, which slowed a few exercises down.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Ravneet Bhatia',
    rating: 4,
    description:
      'Appreciated the focus on accessibility tokens specifically. Not enough workshops cover that well.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Simone Delgado',
    rating: 2,
    description:
      'Screen sharing kept lagging and it made following the live coding portion pretty frustrating.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Tariq Mahmoud',
    rating: 5,
    description:
      'Best design systems workshop I have attended. Clear structure and genuinely useful templates.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Ursula Nowak',
    rating: 4,
    description:
      'Great facilitator, kept the energy up even during the more theory-heavy segments.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Viggo Andersen',
    rating: 3,
    description:
      'Content was useful but assumed a bit more Figma familiarity than the invite suggested.',
  },
  {
    eventId: EVENT_IDS.designSystemsWorkshop,
    submitterName: 'Winnie Osei-Bonsu',
    rating: 5,
    description:
      'Exactly what our team needed. Already scheduled an internal follow-up based on the exercises.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Xander Kowalczyk',
    rating: 5,
    description:
      'Best meetup I have been to this year. Met three people I am now collaborating with on a side project.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Yasmin El-Sayed',
    rating: 3,
    description:
      'Nice casual vibe and friendly crowd, though I wish there had been more structured lightning talks.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Zachariah Voss',
    rating: 4,
    description:
      'Great turnout and the venue had plenty of space to actually hear people during conversations.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Amara Nwosu',
    rating: 5,
    description:
      'Loved the informal demo table setup. Way more engaging than a straight lecture format.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Benedikt Hofer',
    rating: 2,
    description:
      'Ran a bit disorganized this time, and it was hard to tell when talks were actually starting.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Consuela Ramirez',
    rating: 4,
    description:
      'Really welcoming for newcomers. Someone specifically introduced me around, which I appreciated.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Dashiell Okonkwo',
    rating: 5,
    description:
      'Spring edition was a great excuse to get outside for the after-party too. Well organized end to end.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Esperanza Castillo',
    rating: 3,
    description:
      'Fine meetup, but the lightning talks skewed heavily toward one topic this time around.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Frederik Lindberg',
    rating: 4,
    description:
      'Good energy from the organizers, and the pizza situation was actually handled well for once.',
  },
  {
    eventId: EVENT_IDS.communityMeetup,
    submitterName: 'Giulia Moretti',
    rating: 5,
    description:
      'Consistently my favorite recurring meetup. The lightning talk format keeps things moving.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Hendrik Van Dijk',
    rating: 4,
    description:
      'Great mix of workshops and open discussion. The session on scaling team culture was especially timely.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Ingeborg Solheim',
    rating: 1,
    description:
      'Felt disorganized this year. Sessions started late and the agenda changed without much notice.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Jonas Petrovic',
    rating: 5,
    description:
      'The small-group format made it easy to have real conversations instead of surface-level networking.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Katarzyna Wojcik',
    rating: 3,
    description:
      'Useful content, but the retreat location made travel logistics harder than they needed to be.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Leopold Andrade',
    rating: 4,
    description:
      'Appreciated the candor in the leadership panel. Rare to hear people admit what did not work.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Miriam Achterberg',
    rating: 5,
    description:
      'This retreat directly changed how I run my 1:1s. Worth every minute out of the office.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Nikolaus Brandt',
    rating: 2,
    description:
      'Too much unstructured time for my taste. Would have preferred more facilitated sessions.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Ophelia Cardoso',
    rating: 4,
    description:
      'Good balance of strategic discussion and practical takeaways. The retro exercise was a highlight.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Piotr Zielinski',
    rating: 5,
    description:
      'Genuinely one of the better leadership offsites I have attended. The facilitators kept it focused.',
  },
  {
    eventId: EVENT_IDS.engineeringLeadershipRetreat,
    submitterName: 'Quiana Robertson',
    rating: 3,
    description:
      'Decent retreat overall, though the closing session on OKRs felt like a rerun of last year\u2019s.',
  },
];
