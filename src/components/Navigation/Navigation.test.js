import '@testing-library/jest-dom';
import { screen, render, fireEvent } from '@testing-library/react';
import Navigation from './Navigation';

jest.mock('../Logo/Logo.js', () => () => <div data-testid="logo">Logo</div>);
jest.mock('../Themes/Themes.js', () => () => (
  <div data-testid="themes">Themes</div>
));
jest.mock('../Profile/Profile.js', () => ({ onRouteChange }) => (
  <button data-testid="profile" onClick={() => onRouteChange('signout')}>
    Profile
  </button>
));

const mockOnRouteChange = jest.fn();

describe('Navigation component', () => {
  test('renders Themes and Logo', () => {
    render(<Navigation onRouteChange={mockOnRouteChange} isSignedIn={false} />);

    expect(screen.getByTestId('logo')).toBeInTheDocument();
    expect(screen.getByTestId('themes')).toBeInTheDocument();
  });

  test('render Profile when signed in', () => {
    render(<Navigation onRouteChange={mockOnRouteChange} isSignedIn={true} />);

    expect(screen.getByTestId('profile')).toBeInTheDocument();
  });

  test('does not render Profile when not signed in', () => {
    render(<Navigation onRouteChange={mockOnRouteChange} isSignedIn={false} />);

    expect(screen.queryByTestId('profile')).not.toBeInTheDocument();
  });

  test('calls onRouteChange when Profile is clicked', async () => {
    render(<Navigation onRouteChange={mockOnRouteChange} isSignedIn={true} />);

    const profileButton = screen.getByTestId('profile');
    fireEvent.click(profileButton);

    expect(mockOnRouteChange).toHaveBeenCalledWith('signout');
  });
});
