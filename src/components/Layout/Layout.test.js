import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';

const mockOnRouteChange = jest.fn();
const renderLogo = () =>
  render(
    <MemoryRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <Layout isSignedIn={true} onRouteChange={mockOnRouteChange} />
    </MemoryRouter>
  );

jest.mock('../Background/Background.js', () => () => (
  <div data-testid="background">Background</div>
));
jest.mock(
  '../Navigation/Navigation.js',
  () =>
    ({ isSignedIn, onRouteChange }) =>
      (
        <div data-testid="navigation">
          <span>Navigation</span>
          <span>Signed in: {isSignedIn ? 'yes' : 'no'}</span>
          <button onClick={() => onRouteChange('home')}>
            Trigger Route Change
          </button>
        </div>
      )
);

describe('Layout component', () => {
  test('renders Background and Navigation', () => {
    renderLogo();

    expect(screen.getByTestId('background')).toBeInTheDocument();
    expect(screen.getByTestId('navigation')).toHaveTextContent(
      'Signed in: yes'
    );
  });

  test('renders child routes via Outlet', () => {
    render(
      <MemoryRouter
        initialEntries={['/child']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <Routes>
          <Route
            path="/"
            element={<Layout isSignedIn={false} onRouteChange={jest.fn()} />}
          >
            <Route path="child" element={<div>Child content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  test('calls onRouteChange when Navigation triggers it', () => {
    renderLogo();

    screen.getByText(/trigger route change/i).click();
    expect(mockOnRouteChange).toHaveBeenCalledWith('home');
  });
});
