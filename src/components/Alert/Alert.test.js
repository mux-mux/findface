import '@testing-library/jest-dom';
import { screen, render, fireEvent } from '@testing-library/react';
import Alert from './Alert';

describe('Alert component', () => {
  test('renders the alert message', () => {
    render(<Alert onClick={() => {}} message="Profile successfully updated" />);

    expect(
      screen.getByText(/profile successfully updated/i)
    ).toBeInTheDocument();
  });
  test('applies success styles when message contains "success"', () => {
    render(<Alert onClick={() => {}} message="Success: Operation completed" />);

    const alertDiv = screen
      .getByText(/success: operation completed/i)
      .getByRole('alert');

    expect(alertDiv).toHaveClass(
      'bg-teal-100',
      'border-teal-400',
      'text-teal-700'
    );
  });
  test('applies error styles when message does not contain "success"', () => {
    render(<Alert onClick={() => {}} message="Error: Something went wrong" />);

    const alertDiv = screen
      .getByText(/error: something went wrong/i)
      .getByRole('alert');

    expect(alertDiv).toHaveClass(
      'bg-red-100',
      'border-red-400',
      'text-red-700'
    );
  });

  test('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    render(
      <Alert onClose={onCloseMock} message="Success: Operation completed" />
    );

    const closeButton = screen.getByRole('button', {
      name: /close success: operation completed/i,
    });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});
