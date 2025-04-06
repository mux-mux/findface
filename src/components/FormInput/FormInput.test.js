import '@testing-library/jest-dom';
import { screen, render, fireEvent } from '@testing-library/react';
import FormInput from './FormInput';

describe('FormInput component', () => {
  const defaultProps = {
    id: 'email',
    name: 'email',
    type: 'email',
    label: 'Email Address',
    value: '',
    onChange: jest.fn(),
    autoComplete: 'email',
    required: true,
    maxLength: 50,
    placeholder: 'Enter your email',
  };

  test('renders input with label and attributes', () => {
    render(<FormInput {...defaultProps} />);

    const input = screen.getByLabelText(/email address/i);

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('autoComplete', 'email');
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('maxLength', '50');
    expect(input).toHaveAttribute('placeholder', 'Enter your email');
  });

  test('calls onChange when value changes', () => {
    render(<FormInput {...defaultProps} />);

    const input = screen.getByLabelText(/email address/i);
    fireEvent.change(input, { target: { value: 'email@example.com' } });

    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('displays error message when error is passed', () => {
    const errorMessage = 'Invalid email';
    render(<FormInput {...defaultProps} error={errorMessage} />);

    expect(screen.getByRole('alert')).toHaveTextContent(errorMessage);
  });
});
