import '@testing-library/jest-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import useStatus from '../../hooks/useStatus';
import Modal from './Modal';

const mockOnClose = jest.fn();
const mockSetStatus = jest.fn();

const mockUser = {
  id: 1,
  name: 'user',
  email: 'user@example.com',
  age: 30,
  profileImage: 'profile.jpg',
  entries: 5,
  joined: '2025-04-04',
};

jest.mock('../../hooks/useUser.js', () => ({
  useUser: () => ({
    user: mockUser,
    setUser: jest.fn(),
    loadUser: jest.fn(),
    onUserDataChange: jest.fn(),
  }),
}));
jest.mock('../../hooks/useStatus', () => jest.fn());
jest.mock('../ProfileImage/ProfileImage.js', () => ({ src, alt, size }) => (
  <img src={src} alt={alt} size={size} />
));
jest.mock('../Spinner/Spinner.js', () => () => (
  <div data-testid="spinner">Spinner</div>
));
jest.mock('../Alert/Alert.js', () => ({ message, onClose }) => (
  <div>
    <span>{message}</span>
    <button onClick={onClose}>Close</button>
  </div>
));

beforeEach(() => {
  useStatus.mockReturnValue({ status: 'idle', setStatus: mockSetStatus });
});

const renderModal = () => render(<Modal onClose={mockOnClose} />);

describe('Modal component', () => {
  test('renders the Modal with initial state', () => {
    renderModal();

    expect(screen.getByText(mockUser.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockUser.entries} images`)).toBeInTheDocument();
    expect(screen.getByDisplayValue(mockUser.email)).toBeDisabled();
    expect(screen.getByDisplayValue(mockUser.age)).toBeDisabled();
    expect(screen.getByAltText(`${mockUser.name} profile`)).toHaveAttribute(
      'src',
      mockUser.profileImage
    );
  });

  test('enables fields and updates input values', () => {
    renderModal();

    const emailInput = screen.getByDisplayValue(mockUser.email);
    const ageInput = screen.getByDisplayValue(mockUser.age.toString());

    fireEvent.click(screen.getByLabelText(/Edit your age/i));
    expect(ageInput).not.toBeDisabled();
    fireEvent.click(screen.getByLabelText(/Edit your email/i));
    expect(emailInput).not.toBeDisabled();

    fireEvent.change(ageInput, { target: { value: '35' } });
    expect(ageInput.value).toBe('35');
    fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
    expect(emailInput.value).toBe('newemail@example.com');
  });

  test('updates profile image preview on upload', async () => {
    const file = new File(['dummy content'], 'example.png', {
      type: 'image/png',
    });
    const mockReader = {
      readAsDataURL: jest.fn(),
      onloadend: jest.fn(),
      result: 'data:image/png;base64,dummycontent',
    };
    window.FileReader = jest.fn(() => mockReader);

    renderModal();

    const fileInput = screen.getByLabelText(/upload an image from PC/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      mockReader.onloadend();
      expect(screen.getByAltText(`${mockUser.name} profile`)).toHaveAttribute(
        'src',
        mockReader.result
      );
    });
  });

  test('shows spinner when status is loading', () => {
    useStatus.mockReturnValue({
      status: 'loading',
      setStatus: mockSetStatus,
    });

    renderModal();

    expect(screen.getByText(/spinner/i)).toBeInTheDocument();
  });

  test('calls onClose when Cancel button is clicked', () => {
    renderModal();

    fireEvent.click(screen.getByText(/cancel/i));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('displays alert when status is error or success', () => {
    useStatus.mockReturnValue({ status: 'error', setStatus: mockSetStatus });

    renderModal();

    screen.getByRole('button', {
      name: /close/i,
    });
    fireEvent.click(screen.getByText(/close/i));
    expect(mockSetStatus).toHaveBeenCalledWith('idle');
  });
});
