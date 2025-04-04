import '@testing-library/jest-dom';
import { screen, render, fireEvent } from '@testing-library/react';
import ImageForm from './ImageForm';

const mockOnInputChange = jest.fn();
const mockOnImageSubmit = jest.fn();

const renderImageForm = () =>
  render(
    <ImageForm
      onInputChange={mockOnInputChange}
      onImageSubmit={mockOnImageSubmit}
    />
  );

describe('ImageForm component', () => {
  test('renders the component correctly', () => {
    renderImageForm();

    expect(
      screen.getByText(/input image url to find faces/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', {
        name: /input image url to find faces on it/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /find the face\/faces in the image/i })
    ).toBeInTheDocument();
  });

  test('calls onInputChange when typing in the input field', () => {
    renderImageForm();

    const input = screen.getByRole('textbox', {
      name: /input image url to find faces on it/i,
    });
    fireEvent.change(input, {
      target: { value: 'https://example.com/image.jpg' },
    });

    expect(mockOnInputChange).toHaveBeenCalledTimes(1);
    expect(mockOnInputChange).toHaveBeenCalledWith(expect.any(Object));
  });

  test('calls onImageSubmit on form submit', () => {
    renderImageForm();

    const form = screen.getByTestId('image-form');
    fireEvent.submit(form);

    expect(mockOnImageSubmit).toHaveBeenCalledTimes(1);
    expect(mockOnImageSubmit).toHaveBeenCalledWith(expect.any(Object));
  });
});
