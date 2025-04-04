import '@testing-library/jest-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import Signin from './Signin';

jest.mock('../../hooks/useStatus', () => () => ({
  status: 'idle',
  setStatus: jest.fn(),
}));
jest.mock('../../hooks/useValidation', () => {
  const VALIDATIONS = require('../../constants');

  return () => ({
    validateInput: {
      email: jest.fn((value) => (!value.includes('@') ? 'Invalid email' : '')),
      password: jest.fn((value) =>
        value.length < VALIDATIONS.MIN_PASS_LENGTH ? 'Password too short' : ''
      ),
    },
  });
});

const mockOnRouteChange = jest.fn();
const mockLoadUser = jest.fn();

const renderComponent = () =>
  render(<Signin onRouteChange={mockOnRouteChange} loadUser={mockLoadUser} />);

describe('Signin component', () => {
  test('renders the Sing in form', () => {
    renderComponent();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign in/i })
    ).toBeInTheDocument();
  });

  test('displays validation errors on invalid input', async () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/password too short/i)).toBeInTheDocument();
    });
  });

  test('calls API and handles successful login', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ success: 'true', userId: '123' }),
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ email: 'email@example.com' }),
      });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'email@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLoadUser).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockOnRouteChange).toHaveBeenCalledWith('home');
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
