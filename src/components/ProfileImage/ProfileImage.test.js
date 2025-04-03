import '@testing-library/jest-dom';
import { screen, render } from '@testing-library/react';
import ProfileImage from './ProfileImage';

describe('ProfileImage component', () => {
  test('renders an image when src is provided', () => {
    render(
      <ProfileImage
        src="https://example.com/image.jpg"
        alt="Profile"
        size="md"
      />
    );

    const image = screen.getByAltText('Profile');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  test('renders default size (md) when size is not provided', () => {
    render(<ProfileImage src="https://example.com/image.jpg" alt="Profile" />);

    expect(screen.getByAltText('Profile')).toHaveClass('w-20 h-20');
  });

  test('renders correct size when provided', () => {
    render(
      <ProfileImage
        src="https://example.com/image.jpg"
        alt="Profile"
        size="lg"
      />
    );

    expect(screen.getByAltText('Profile')).toHaveClass('w-24 h-24');
  });

  test('renders a default SVG when no src is provided', () => {
    render(<ProfileImage alt="Default Profile" />);

    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toBeInTheDocument();
  });

  test('applies correct size class to SVG when no src is provided', () => {
    render(<ProfileImage alt="Default Profile" size="sm" />);

    const svg = screen.getByRole('img', { hidden: true });
    expect(svg).toHaveClass('w-12 h-14');
  });
});
