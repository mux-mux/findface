import { useState, useCallback } from 'react';
import { NavLink } from 'react-router';
import DOMPurify from 'dompurify';
import Spinner from '../Spinner/Spinner.js';
import Alert from '../Alert/Alert.js';
import AuthButton from '../AuthButton/AuthButton.js';
import FormInput from '../FormInput/FormInput.js';
import useStatus from '../../hooks/useStatus.js';
import useValidation from '../../hooks/useValidation.js';
import VALIDATIONS from '../../constants.js';

const { MAX_EMAIL_LENGTH, MAX_PASS_LENGTH } = VALIDATIONS;

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
        <h1 className="visually-hidden">
          Find Face - AI powered App to detect faces in the image. Apply filters
          and download it
        </h1>
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
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
            maxLength={MAX_EMAIL_LENGTH}
          />
          <FormInput
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            autoComplete="current-password"
            required
            maxLength={MAX_PASS_LENGTH}
          />
          <AuthButton
            status={status}
            errors={errors}
            loadingText="Signing in..."
            defaultText="Sign in"
            ariaLabel="Sign in to account"
          />
        </form>

        <p className="mt-10 text-center text-sm">
          Not a member?
          <NavLink
            to="/register"
            className="ml-1 font-semibold leading-6 hover:text-blue-500"
            aria-label="Create a new account"
          >
            Register
          </NavLink>
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
