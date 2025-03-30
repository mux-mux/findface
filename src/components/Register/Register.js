import { useState } from 'react';
import DOMPurify from 'dompurify';
import Spinner from '../Spinner/Spinner.js';
import Alert from '../Alert/Alert.js';
import useStatus from '../../hooks/useStatus.js';
import useValidation from '../../hooks/useValidation.js';

const Register = ({ onRouteChange, loadUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const { status, setStatus } = useStatus('idle');
  const { validateInput } = useValidation();

  const onEmailChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9@._-]/g, '');
    setEmail(value);
    setErrors((prev) => ({ ...prev, email: validateInput.email(value) }));
  };
  const onPasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prev) => ({ ...prev, password: validateInput.password(value) }));
  };
  const onNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9-.]/g, '');
    setName(value);
    setErrors((prev) => ({ ...prev, name: validateInput.name(value) }));
  };

  const saveSessionToken = (token) => {
    window.localStorage.setItem('token', token);
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();
    setStatus('loading');

    const sanitizedName = DOMPurify.sanitize(name.trim());
    const sanitizedEmail = DOMPurify.sanitize(email.trim());

    const nameError = validateInput.name(sanitizedName);
    const emailError = validateInput.email(sanitizedEmail);
    const passwordError = validateInput.password(password);

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
      });
      setStatus('error');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/register', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sanitizedName,
          email: sanitizedEmail,
          password,
        }),
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
        throw new Error(json.message || 'Registration failed');
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
              className="block text-sm font-medium leading-6 pb-2"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength="60"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              onChange={onNameChange}
              value={name}
            />
            {errors.name && (
              <span
                className="absolute text-red-500 text-xs mt-1"
                role="alert"
                aria-live="polite"
              >
                {errors.name}
              </span>
            )}
          </div>

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
              onChange={onEmailChange}
              value={email}
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
              onChange={onPasswordChange}
              value={password}
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
              aria-label="Create a new account"
            >
              {status === 'loading' ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm">
          Already a member?
          <button
            className="ml-1 font-semibold leading-6 hover:text-blue-500"
            onClick={() => onRouteChange('signin')}
            aria-label="Sign in to account"
          >
            Signin
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

export default Register;
