import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import Rank from './Rank';

global.fetch = jest.fn();

describe('Rank component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ input: '😎' }),
    });
  });

  test('render component', async () => {
    render(<Rank userName="John" userEntries={5} />);

    expect(
      screen.getByText(/John, your current find face tries count is/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/rank badge: 😎/i)).toBeInTheDocument();
    });
  });

  test('fetches and displays emoji badge on successful API call', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ input: '🔥' }),
    });

    render(<Rank userName="Alan" userEntries={10} />);

    await waitFor(() => {
      expect(screen.getByText(/rank badge: 🔥/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'https://znq0m5iub3.execute-api.us-east-1.amazonaws.com/prod/rank?rank=10'
    );
  });

  test('displays default emoji if API returns invalid response', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(<Rank userName="Charlie" userEntries={20} />);

    await waitFor(() => {
      expect(screen.getByText(/rank badge: 🤔/i)).toBeInTheDocument();
    });
  });
});
