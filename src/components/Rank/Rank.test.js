import '@testing-library/jest-dom';
import { screen, render, waitFor } from '@testing-library/react';
import Rank from './Rank';

global.fetch = jest.fn();

describe('Rank component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render component', () => {
    render(<Rank userName="John" userEntries={5} />);

    expect(
      screen.getByText(/John, your current find face tries count is/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  test('fetches and displays emoji badge on successful API call', async () => {
    global.fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ input: '🔥' }),
    });

    render(<Rank userName="Alan" userEntries={10} />);

    await waitFor(() => {
      expect(screen.getByText(/rank badge: 🔥/i)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://znq0m5iub3.execute-api.us-east-1.amazonaws.com/prod/rank?rank=10'
    );
  });

  test('displays default emoji if API call fails', async () => {
    global.fetch.mockResolvedValueOnce(new Error('API Error'));

    render(<Rank userName="Bob" userEntries={15} />);

    await waitFor(() => {
      expect(screen.getByText(/rank badge: 🤔/i)).toBeInTheDocument();
    });
    expect(global.fetch).toHaveBeenCalled();
  });
});
