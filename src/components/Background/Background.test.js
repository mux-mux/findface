import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Background from './Background';

describe('Background component', () => {
  test('to have "background" className', () => {
    render(<Background />);

    expect(screen.getByTestId('background')).toHaveClass('background');
  });
});
