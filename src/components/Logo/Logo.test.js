import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Logo from './Logo';

const renderLogo = () => {
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Logo />
    </MemoryRouter>
  );
};

describe('Logo component', () => {
  test('renders the logo image with correct attributes', () => {
    renderLogo();

    const logoImg = screen.getByAltText(/find face logo/i);

    expect(logoImg).toBeInTheDocument();
    expect(logoImg).toHaveAttribute(
      'src',
      process.env.PUBLIC_URL + '/logo192.png'
    );
    expect(logoImg).toHaveAttribute('fetchpriority', 'high');
  });

  test('renders a link that navigates to homepage', () => {
    renderLogo();

    const homeLink = screen.getByRole('link', { name: /go back to homepage/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
