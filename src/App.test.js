import '@testing-library/jest-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./components/Signin/Signin.js', () => (props) => (
  <div data-testid="signin">
    <button onClick={() => props.onRouteChange('register')}>Register</button>
    <button onClick={() => props.onRouteChange('home')}>Home</button>
  </div>
));
jest.mock('./components/Register/Register.js', () => (props) => (
  <div data-testid="register">
    <button onClick={() => props.onRouteChange('signin')}>Signin</button>
  </div>
));
jest.mock('./components/Rank/Rank.js', () => ({ userName, userEntries }) => (
  <div data-testid="rank">{`${userName}: ${userEntries}`}</div>
));
jest.mock('./components/ImageForm/ImageForm.js', () => (props) => (
  <form onSubmit={props.onImageSubmit}>
    <input
      type="text"
      onChange={(e) => props.onInputChange(e)}
      placeholder="Input URL"
    />
    <button type="submit">Submit</button>
  </form>
));
jest.mock('./components/FindFace/FindFace.js', () => ({ imageUrl }) => (
  <div data-testid="findface">{`Image: ${imageUrl}`}</div>
));
jest.mock('./components/Navigation/Navigation.js', () => (props) => (
  <nav>
    <button onClick={() => props.onRouteChange('signout')}>Sign Out</button>
  </nav>
));
jest.mock('./components/Background/Background.js', () => () => (
  <div data-testid="background" />
));

const renderApp = () => render(<App />);

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders Signin component by default', () => {
    renderApp();

    expect(screen.getByTestId('signin')).toBeInTheDocument();
  });

  test('navigates to Register component when "Register" clicked', () => {
    renderApp();

    fireEvent.click(screen.getByText(/register/i));

    expect(screen.getByTestId('register')).toBeInTheDocument();
  });

  test('navigates back to Signin component from Register', () => {
    renderApp();

    fireEvent.click(screen.getByText(/register/i));
    fireEvent.click(screen.getByText(/signin/i));

    expect(screen.getByTestId('signin')).toBeInTheDocument();
  });

  test('renders Rank and ImageForm when route is home', () => {
    renderApp();

    fireEvent.click(screen.getByText('Home'));

    expect(screen.getByTestId('rank')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/input URL/i)).toBeInTheDocument();
  });

  test('shows FindFace component after submitting an image URL', async () => {
    renderApp();

    fireEvent.click(screen.getByText(/home/i));
    fireEvent.change(screen.getByPlaceholderText('Input URL'), {
      target: { value: 'http://example.com/image.jpg' },
    });
    fireEvent.click(screen.getByText(/submit/i));

    await waitFor(() => {
      expect(screen.getByTestId('findface')).toHaveTextContent(
        'Image: http://example.com/image.jpg'
      );
    });
  });

  test('signs out and returns to Signin', () => {
    renderApp();

    fireEvent.click(screen.getByText(/home/i));
    fireEvent.click(screen.getByText(/sign out/i));

    expect(screen.getByTestId('signin')).toBeInTheDocument();
  });

  test('fetches user and routes to home if token is valid', async () => {
    const user = {
      id: '123',
      name: 'user',
      email: 'email@example.com',
      profileImage: '',
      age: 30,
      entries: 5,
      joined: '2025-04-06',
    };

    localStorage.setItem('token', 'test-token');

    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        json: async () => ({ id: '123' }),
      })
      .mockResolvedValueOnce({
        json: async () => user,
      });

    renderApp();

    await waitFor(() => {
      expect(screen.getByTestId('rank')).toHaveTextContent('user: 5');
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
});
