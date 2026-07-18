import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

async function selectEvent(user: ReturnType<typeof userEvent.setup>, eventName: string) {
  await user.click(screen.getByRole('combobox', { name: 'Event' }));
  await user.click(await screen.findByRole('option', { name: eventName }));
}

describe('App', () => {
  it('renders the branded header, form, stream, and footer', () => {
    render(<App />);

    expect(screen.getByAltText('Event Feedback Hub logo')).toBeInTheDocument();
    expect(
      screen.getByText((_, element) => element?.tagName === 'SPAN' && element.textContent === 'Event Feedback Hub'),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: /share your feedback/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /feedback from attendees/i })).toBeInTheDocument();

    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });

  it('reveals the rating and review fields only after an event is selected', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.queryByRole('radiogroup', { name: /rating/i })).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/your review/i)).not.toBeInTheDocument();

    await selectEvent(user, 'Annual Tech Summit 2026');

    expect(screen.getByRole('radiogroup', { name: /rating/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/your review/i)).toBeInTheDocument();
  });

  it('submits new feedback and prepends it to the stream with the submitter name', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectEvent(user, 'Annual Tech Summit 2026');
    await user.click(screen.getByRole('radio', { name: '4 stars' }));
    await user.type(
      screen.getByLabelText(/your review/i),
      'Really enjoyed the sessions this year.',
    );
    await user.click(screen.getByRole('button', { name: /submit feedback/i }));

    const stream = screen.getByRole('list');
    const firstCard = within(stream).getAllByRole('listitem')[0];

    expect(within(firstCard).getByText('Annual Tech Summit 2026')).toBeInTheDocument();
    expect(
      within(firstCard).getByText('Really enjoyed the sessions this year.'),
    ).toBeInTheDocument();
    expect(within(firstCard).getByText('You')).toBeInTheDocument();
    expect(
      within(firstCard).getByRole('img', { name: /rated 4 out of 5 stars/i }),
    ).toBeInTheDocument();
  });

  it('submits the form when pressing ctrl+enter or meta+enter in the review textarea', async () => {
    const user = userEvent.setup();
    render(<App />);

    await selectEvent(user, 'Design Systems Workshop');
    await user.click(screen.getByRole('radio', { name: '5 stars' }));

    const review = screen.getByLabelText(/your review/i);
    await user.type(review, 'Submitted via keyboard shortcut.');
    await user.type(review, '{Control>}{Enter}{/Control}');

    const stream = screen.getByRole('list');
    const firstCard = within(stream).getAllByRole('listitem')[0];
    expect(within(firstCard).getByText('Submitted via keyboard shortcut.')).toBeInTheDocument();
  });

  it('displays event name, rating, review text, and submitter for existing feedback cards', () => {
    render(<App />);

    const stream = screen.getByRole('list');
    const cards = within(stream).getAllByRole('listitem');
    const firstCard = cards[0];

    expect(within(firstCard).getByText('Maria Chen')).toBeInTheDocument();
    expect(within(firstCard).getByText(/fantastic lineup of speakers/i)).toBeInTheDocument();
    expect(
      within(firstCard).getByRole('img', { name: /rated 5 out of 5 stars/i }),
    ).toBeInTheDocument();

    const timestamp = within(firstCard).getByText(/ago$/i);
    expect(timestamp.tagName).toBe('TIME');
    expect(timestamp).toHaveAttribute('dateTime', '2026-03-15T09:24:00Z');
    expect(timestamp).toHaveAttribute('title');
    expect(timestamp.getAttribute('title')).not.toHaveLength(0);
  });

  it('allows toggling individual star ratings within the rating filter without altering the list', async () => {
    const user = userEvent.setup();
    render(<App />);

    const stream = screen.getByRole('list');
    const initialCount = within(stream).getAllByRole('listitem').length;

    await user.click(screen.getByRole('button', { name: /all ratings/i }));
    const fiveStarCheckbox = await screen.findByRole('checkbox', { name: '5 stars' });
    await user.click(fiveStarCheckbox);

    expect(fiveStarCheckbox).toHaveAttribute('data-state', 'checked');
    expect(within(stream).getAllByRole('listitem')).toHaveLength(initialCount);
  });
});
