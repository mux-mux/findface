import '@testing-library/jest-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';

import Profile from './Profile';

const mockOnRouteChange = jest.fn();
const mockLoadUser = jest.fn();

jest.mock('../../hooks/useUser.js', () => ({
  useUser: () => ({
    user: {
      id: 0,
      name: 'user',
      profileImage: 'https://example.com/profile.jpg',
    },
    setUser: jest.fn(),
    loadUser: mockLoadUser,
    onUserDataChange: jest.fn(),
  }),
}));

const mockUser = {
  name: 'user',
  profileImage: 'https://example.com/profile.jpg',
};

const renderProfile = () =>
  render(<Profile onRouteChange={mockOnRouteChange} />);

describe('Profile component', () => {
  test('render profile image correctly', () => {
    renderProfile();

    const profileImage = screen.getByAltText(`${mockUser.name} profile`);

    expect(profileImage).toBeInTheDocument();
    expect(profileImage).toHaveAttribute('src', mockUser.profileImage);
  });

  test('opens the dropdown menu when profile image is clicked', async () => {
    renderProfile();

    const profileButton = screen.getByRole('button', {
      name: /open profile dropdown menu/i,
    });

    fireEvent.click(profileButton);

    await waitFor(() => {
      expect(
        screen.getByRole('menuitem', { name: /account settings/i })
      ).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(
        screen.getByRole('menuitem', { name: /log out/i })
      ).toBeInTheDocument();
    });
  });

  test('opens modal when clicking "Account settings"', async () => {
    renderProfile();

    const profileButton = screen.getByRole('button', {
      name: /open profile dropdown menu/i,
    });

    fireEvent.click(profileButton);

    const settingsButton = await screen.findByRole('menuitem', {
      name: /account settings/i,
    });

    fireEvent.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  test('calls onRouteChange with "signout" when "Sign out" is clicked', async () => {
    renderProfile();

    const profileButton = screen.getByRole('button', {
      name: /open profile dropdown menu/i,
    });

    fireEvent.click(profileButton);

    const signOutButton = await screen.findByRole('menuitem', {
      name: /log out/i,
    });

    fireEvent.click(signOutButton);

    expect(mockOnRouteChange).toHaveBeenCalledWith('signout');
  });
});
