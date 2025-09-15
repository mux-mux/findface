import { useState } from 'react';
import DOMPurify from 'dompurify';
import { NavLink } from 'react-router';
import Spinner from '../Spinner/Spinner.js';
import Alert from '../Alert/Alert.js';
import AuthButton from '../AuthButton/AuthButton.js';
import FormInput from '../FormInput/FormInput.js';
import useStatus from '../../hooks/useStatus.js';
import useValidation from '../../hooks/useValidation.js';
import VALIDATIONS from '../../constants.js';

const { MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PASS_LENGTH } = VALIDATIONS;

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
          <FormInput
            id="name"
            name="name"
            type="text"
            label="Name"
            value={name}
            onChange={onNameChange}
            error={errors.name}
            autoComplete="name"
            required
            maxLength={MAX_NAME_LENGTH}
          />
          <FormInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            value={email}
            onChange={onEmailChange}
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
            value={password}
            onChange={onPasswordChange}
            error={errors.password}
            autoComplete="current-password"
            required
            maxLength={MAX_PASS_LENGTH}
          />
          <AuthButton
            status={status}
            errors={errors}
            loadingText="Registering..."
            defaultText="Register"
            ariaLabel="Create a new account"
          />
        </form>

        <p className="mt-10 text-center text-sm">
          Already a member?
          <NavLink
            to="/signin"
            className="ml-1 font-semibold leading-6 hover:text-blue-500"
            aria-label="Sign in to account"
          >
            Signin
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

export default Register;
