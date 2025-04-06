import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import AuthButton from './AuthButton';

describe('AuthButton component', () => {
  const defaultProps = {
    status: 'idle',
    errors: {},
    loadingText: 'Submiting...',
    defaultText: 'Submit',
    ariaLabel: 'Create a new account',
  };

  test('renders with default text', () => {
    render(<AuthButton {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: /create a new account/i })
    ).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeEnabled();
  });

  test('renders loading text and disables button when status is loading', () => {
    render(<AuthButton {...defaultProps} status="loading" />);

    const button = screen.getByRole('button');

    expect(button).toHaveTextContent('Submiting...');
    expect(button).toBeDisabled();
  });

  test('disables button when there are validation errors', () => {
    const errors = {
      email: 'Email is invalid',
      password: '',
    };

    render(<AuthButton {...defaultProps} errors={errors} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('enables button when there are no errors and not loading', () => {
    const errors = {
      email: '',
      password: '',
    };

    render(<AuthButton {...defaultProps} errors={errors} />);

    expect(screen.getByRole('button')).toBeEnabled();
  });
});
