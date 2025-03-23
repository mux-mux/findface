const useValidation = () => {
  const VALIDATIONS = {
    MIN_NAME_LENGTH: 2,
    MIN_PASS_LENGTH: 4,
  };
  const { MIN_NAME_LENGTH, MIN_PASS_LENGTH } = VALIDATIONS;

  const MESSAGES = {
    MIN_PASS_LENGTH: `Password must be at least ${MIN_PASS_LENGTH} characters long`,
    PASS_INCLUDE_NUMBER: 'Password must include at least one number',
    MIN_NAME_LENGTH: `Name must be at least ${MIN_NAME_LENGTH} characters`,
    EMAIL_FORMAT: 'Email format: email@domain.com',
  };

  const validateInput = {
    name: (value) => {
      if (!value) return '';
      if (value.length < MIN_NAME_LENGTH) return MESSAGES.MIN_NAME_LENGTH;
      return '';
    },
    email: (value) => {
      if (!value) return '';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? ''
        : MESSAGES.EMAIL_FORMAT;
    },
    password: (value) => {
      if (!value) return '';
      if (value.length < MIN_PASS_LENGTH) return MESSAGES.MIN_PASS_LENGTH;
      if (!/\d/.test(value)) return MESSAGES.PASS_INCLUDE_NUMBER;
      return '';
    },
  };

  return { validateInput };
};

export default useValidation;
