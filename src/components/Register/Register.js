import { useState } from 'react';
import DOMPurify from 'dompurify';
import Spinner from '../Spinner/Spinner.js';
import Alert from '../Alert/Alert.js';
import useStatus from '../../hooks/useStatus.js';

import './Register.css';

const Register = ({ onRouteChange, loadUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const { status, setStatus } = useStatus('idle');

  const sanitizeInput = (value) => DOMPurify.sanitize(value.trim());

  const onEmailChange = (e) => setEmail(sanitizeInput(e.target.value));
  const onPasswordChange = (e) => setPassword(sanitizeInput(e.target.value));
  const onNameChange = (e) => setName(sanitizeInput(e.target.value));

  const saveSessionToken = (token) => {
    window.localStorage.setItem('token', token);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+=-]{4,}$/.test(password);

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    setStatus('loading');

    if (!name || name.length < 2) {
      setMessage('Name must be at least 2 characters');
      setStatus('error');
      return;
    }

    if (!isValidEmail(email)) {
      setMessage('Invalid email format');
      setStatus('error');
      return;
    }

    if (!isValidPassword(password)) {
      setMessage(
        'Password must be at least 4 characters long and include a number'
      );
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await response.json();
      const { user, data } = json;

      if (user && user.id) {
        saveSessionToken(data.token);
        loadUser(user);
        onRouteChange('home');
        setStatus('success');
      } else {
        setMessage(json);
        throw new Error();
      }
    } catch (error) {
      setMessage(error.message || 'Something went wrong, please try again.');
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Register your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={onSubmitRegister}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength="60"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                onChange={onNameChange}
              />
            </div>
          </div>

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
              Register
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm">
          Already a member?
          <a
            href="##"
            className="ml-1 font-semibold leading-6 hover:text-blue-500"
            onClick={() => onRouteChange('signin')}
          >
            Signin
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

export default Register;
