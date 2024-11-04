import { useState } from 'react';
import Spinner from '../Spinner/Spinner.js';
import Alert from '../Alert/Alert.js';
import useStatus from '../../hooks/useStatus.js';

import './Signin.css';

const Signin = ({ onRouteChange, loadUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { status, setStatus } = useStatus('idle');

  const onEmailChange = (e) => setEmail(e.target.value);
  const onPasswordChange = (e) => setPassword(e.target.value);

  const saveSessionToken = (token) => {
    window.localStorage.setItem('token', token);
  };

  const onSubmitSignIn = async (e) => {
    e.preventDefault();
    try {
      setStatus('loading');
      const response = await fetch('http://localhost:3001/signin', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.userId && data.success === 'true') {
        saveSessionToken(data.token);
        try {
          const user = await fetch(
            `http://localhost:3001/profile/${data.userId}`,
            {
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                Authorization: data.token,
              },
            }
          );
          const userData = await user.json();

          if (userData && userData.email) {
            loadUser(userData);
            onRouteChange('home');
            setStatus('success');
          } else {
            setMessage(userData);
            throw new Error();
          }
        } catch (error) {
          setStatus('error');
        }
      } else {
        setMessage(data);
        throw new Error();
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-10 w-auto"
          src="https://tailwindcss.com/_next/static/media/tailwindcss-mark.3c5441fc7a190fb1800d4a5c7f07ba4b1345a9c8.svg"
          alt="Tailwind logo"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={onSubmitSignIn}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength="60"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={onEmailChange}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6"
              >
                Password
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                maxLength="200"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={onPasswordChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm">
          Not a member?
          <a
            href="##"
            className="ml-1 font-semibold leading-6 hover:text-blue-500"
            onClick={() => onRouteChange('register')}
          >
            Register
          </a>
        </p>
      </div>
      {status === 'loading' && <Spinner />}
      {status === 'error' && (
        <Alert message={message} onClose={() => setStatus('idle')} />
      )}
    </div>
  );
};

export default Signin;
