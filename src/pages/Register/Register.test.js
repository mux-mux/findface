import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import Register from './Register.js';

let mockStatus = 'idle';
const mockSetStatus = jest.fn();

jest.mock('../../hooks/useStatus', () => () => ({
  status: mockStatus,
  setStatus: mockSetStatus,
}));
jest.mock('../../hooks/useValidation.js', () => {
  const VALIDATIONS = require('../../constants.js').default;
  return () => ({
    validateInput: {
      name: jest.fn((value) =>
        value.length < VALIDATIONS.MIN_NAME_LENGTH ? 'Name too short' : ''
      ),
      email: jest.fn((value) =>
        !value.includes('@') ? 'Invalid email address' : ''
      ),
      password: jest.fn((value) =>
        value.length < VALIDATIONS.MIN_PASS_LENGTH ? 'Password too short' : ''
      ),
    },
  });
});

const mockOnRouteChange = jest.fn();
const mockLoadUser = jest.fn();

const renderRegister = () =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Register onRouteChange={mockOnRouteChange} loadUser={mockLoadUser} />
    </MemoryRouter>
  );

describe('Register component', () => {
  test('renders the Register form', () => {
    renderRegister();

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create a new account/i })
    ).toBeInTheDocument();
  });

  test('displays validation errors on invalid input', async () => {
    renderRegister();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'A' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'invalid email' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '123' },
    });

    await waitFor(() => {
      expect(screen.getByText(/name too short/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.getByText(/password too short/i)).toBeInTheDocument();
    });
  });

  test('submits valid form and handles successful register', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        user: { id: '123', name: 'Jane' },
        data: { token: 'mockToken123' },
      }),
    });

    renderRegister();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'user' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'email@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /create a new account/i })
    );

    await waitFor(() => {
      expect(mockLoadUser).toHaveBeenCalledWith(
        expect.objectContaining({ id: '123' })
      );
    });
    expect(mockOnRouteChange).toHaveBeenCalledWith('home');
  });

  test('displays error message on failed registration', async () => {
    mockStatus = 'error';

    global.fetch = jest.fn().mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({
        message: 'The credentials you entered are incorrect',
      }),
    });

    renderRegister();

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'TestUser' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.click(
      screen.getByRole('button', { name: /create a new account/i })
    );

    await waitFor(() => {
      expect(
        screen.getByText(/the credentials you entered are incorrect/i)
      ).toBeInTheDocument();
    });
  });

  afterEach(() => {
    mockStatus = 'idle';
    jest.clearAllMocks();
  });
});
