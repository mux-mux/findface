import { useState, useCallback } from 'react';
import DOMPurify from 'dompurify';
import Spinner from '../Spinner/Spinner.js';
import Alert from '../Alert/Alert.js';
import useStatus from '../../hooks/useStatus.js';
import useValidation from '../../hooks/useValidation.js';

import './Signin.css';

const Signin = ({ onRouteChange, loadUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const { status, setStatus } = useStatus('idle');
  const { validateInput } = useValidation();

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({ ...prev, [name]: value }));

      setErrors((prev) => ({
        ...prev,
        [name]:
          name === 'email'
            ? validateInput.email(value)
            : validateInput.password(value),
      }));
    },
    [setFormData, validateInput]
  );

  const saveSessionToken = (token) => {
    window.localStorage.setItem('token', token);
  };

  const signinUser = async (email, password) => {
    const response = await fetch('http://localhost:3001/signin', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  };

  const fetchUserProfile = async (userId, token) => {
    const response = await fetch(`http://localhost:3001/profile/${userId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });
    return response.json();
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus('loading');

      const { email, password } = formData;

      const sanitizedEmail = DOMPurify.sanitize(email.trim());

      const emailError = validateInput.email(sanitizedEmail);
      const passwordError = validateInput.password(password);

      if (emailError || passwordError) {
        setErrors({ email: emailError, password: passwordError });
        setStatus('error');
        return;
      }

      try {
        const data = await signinUser(sanitizedEmail, password);

        if (!data.userId || data.success !== 'true') {
          throw new Error(data || 'Invalid credentials');
        }

        saveSessionToken(data.token);

        const userData = await fetchUserProfile(data.userId, data.token);
        if (!userData || !userData.email) {
          throw new Error('Failed to fetch user profile');
        }

        loadUser(userData);
        onRouteChange('home');
        setStatus('success');
      } catch (error) {
        setMessage(error.message);
        setStatus('error');
      }
    },
    [formData, loadUser, onRouteChange, setStatus, validateInput]
  );

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          className="space-y-6"
          action="#"
          method="POST"
          onSubmit={handleSubmit}
        >
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 pb-2"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength="60"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && (
              <span
                className="absolute text-red-500 text-xs mt-1"
                role="alert"
                aria-live="polite"
              >
                {errors.email}
              </span>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 pb-2"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength="200"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && (
              <span
                className="absolute text-red-500 text-xs mt-1"
                role="alert"
                aria-live="polite"
              >
                {errors.password}
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={
                status === 'loading' || Object.values(errors).some((err) => err)
              }
              className="flex w-full justify-center mt-10 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              aria-label="Sign in to account"
            >
              {status === 'loading' ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm">
          Not a member?
          <button
            className="ml-1 font-semibold leading-6 hover:text-blue-500"
            onClick={() => onRouteChange('register')}
            aria-label="Create a new account"
          >
            Register
          </button>
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
