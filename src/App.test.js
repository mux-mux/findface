import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

jest.mock('./pages/Signin/Signin.js', () => (props) => (
  <div data-testid="signin">
    <button onClick={() => props.onRouteChange('register')}>Register</button>
    <button onClick={() => props.onRouteChange('home')}>Home</button>
  </div>
));
jest.mock('./pages/Register/Register.js', () => (props) => (
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

const renderApp = (initialRoute = '/') =>
  render(
    <MemoryRouter
      initialEntries={[initialRoute]}
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </MemoryRouter>
  );

describe('App component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders Signin component by default', () => {
    renderApp();

    expect(screen.getByTestId('signin')).toBeInTheDocument();
  });

  test('renders Register component at /register route', () => {
    renderApp('/register');

    expect(screen.getByTestId('register')).toBeInTheDocument();
  });

  test('navigates back to Signin component from Register', () => {
    renderApp('/signin');

    expect(screen.getByTestId('signin')).toBeInTheDocument();
  });

  test('renders Rank and ImageForm when route is home', () => {
    renderApp();

    fireEvent.click(screen.getByText('Home'));

    expect(screen.getByTestId('rank')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/input URL/i)).toBeInTheDocument();
  });

  test('shows FindFace component after submitting an image URL', async () => {
    global.Image = class {
      constructor() {
        setTimeout(() => {
          if (this.onload) this.onload();
        }, 0);
      }
      set src(_) {}
    };

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

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });
});
