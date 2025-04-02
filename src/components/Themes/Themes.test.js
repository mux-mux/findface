import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import Themes from './Themes';

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

beforeEach(() => {
  Storage.prototype.getItem = jest.fn(() => null);
  Storage.prototype.setItem = jest.fn();
});

describe('Themes component', () => {
  test('renders the theme toggler', () => {
    render(<Themes />);

    const themeCheckbox = screen.getByRole('checkbox');

    expect(themeCheckbox).toBeInTheDocument();
  });

  test('applies the correct theme based on the localStorage', () => {
    Storage.prototype.getItem = jest.fn(() => 'theme-dark');

    render(<Themes />);

    expect(document.documentElement.className).toBe('theme-dark');
  });

  test('applies system preference when no localStorage value exists', () => {
    render(<Themes />);

    const expectedTheme = window.matchMedia('(prefers-color-scheme: dark)')
      .matches
      ? 'theme-dark'
      : 'theme-light';

    expect(document.documentElement.className).toBe(expectedTheme);
  });

  test('toggles theme when the checkbox is clicked', () => {
    render(<Themes />);

    const themeCheckbox = screen.getByRole('checkbox');
    const initialTheme = document.documentElement.className;
    fireEvent.click(themeCheckbox);
    const newTheme = document.documentElement.className;

    expect(newTheme).not.toBe(initialTheme);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'theme',
      expect.stringMatching(/theme-(dark|light)/)
    );
  });
});
