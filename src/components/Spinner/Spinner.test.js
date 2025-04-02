import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner component', () => {
  test('renders the spinner', () => {
    render(<Spinner />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('have the correct default class', () => {
    render(<Spinner />);

    const spinnerContainer = screen.getByRole('status');
    expect(spinnerContainer).toHaveClass('spinner-container');
  });

  test('applies additional classNames', () => {
    render(<Spinner className="absolute" />);

    const spinnerContainer = screen.getByRole('status');
    expect(spinnerContainer).toHaveClass('spinner-container', 'absolute');
  });
});
