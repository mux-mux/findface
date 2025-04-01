import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';

import Logo from './Logo';

describe('Logo component', () => {
  test('renders the logo image with correct attributes', () => {
    render(<Logo />);

    const logoImg = screen.getByAltText(/find face logo/i);

    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute(
      'src',
      process.env.PUBLIC_URL + '/logo192.png'
    );
    expect(logoImg).toHaveAttribute('fetchpriority', 'high');
  });
  test('renders a link that navigates to homepage', () => {
    render(<Logo />);

    const homeLink = screen.getByRole('link', { name: /go back to homepage/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
