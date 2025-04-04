import '@testing-library/jest-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import FindFace from './FindFace';

jest.mock('../Spinner/Spinner.js', () => () => (
  <div data-testid="spinner">Spinner</div>
));
const mockUser = { id: '123' };
const mockSetUser = jest.fn();
const renderFindFace = () =>
  render(
    <FindFace
      imageUrl="http://example.com/image.jpg"
      user={mockUser}
      onUserDataChange={mockSetUser}
    />
  );

describe('FindFace component', () => {
  test('renders without crashing', () => {
    renderFindFace();

    expect(screen.getByAltText('faces')).toBeInTheDocument();
  });

  test('renders all filter buttons', () => {
    renderFindFace();

    const buttons = ['none', 'blur', 'emoji', 'alien', 'dog', 'ghost'];
    buttons.forEach((label) => {
      expect(
        screen.getByRole('button', { name: `Apply a filter ${label}` })
      ).toBeInTheDocument();
    });
  });

  test('allows selecting a filter', () => {
    renderFindFace();

    const blurButton = screen.getByRole('button', { name: /blur/i });
    fireEvent.click(blurButton);

    expect(blurButton).toHaveClass('selected');
  });

  test('shows spinner while downloading image', async () => {
    const mockToBlob = jest.fn((cb) => cb(new Blob()));
    HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      drawImage: jest.fn(),
      fillText: jest.fn(),
      font: '',
      textAlign: '',
      textBaseline: '',
      measureText: () => ({ width: 100 }),
    }));
    HTMLCanvasElement.prototype.toBlob = mockToBlob;

    const originalImage = global.Image;
    global.Image = class {
      constructor() {
        setTimeout(() => this.onload(), 100);
      }
      set src(_) {}
      get width() {
        return 500;
      }
      get height() {
        return 500;
      }
      set crossOrigin(_) {}
    };

    renderFindFace();

    const downloadBtn = screen.getByRole('button', {
      name: /Download the Image with the applied filter/i,
    });

    fireEvent.click(downloadBtn);
    expect(await screen.findByTestId('spinner')).toBeInTheDocument();

    global.Image = originalImage;
  });

  test('throws and logs error when API fetch fails', async () => {
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('API error')));

    renderFindFace();

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    await waitFor(() => {
      const errorCall = consoleErrorSpy.mock.calls.find((call) =>
        call[0].includes('Error fetching face data:')
      );

      expect(errorCall).toBeTruthy();
    });

    consoleErrorSpy.mockRestore();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });
});
