export const VALIDATIONS = {
  MIN_NAME_LENGTH: 2,
  MIN_PASS_LENGTH: 4,
};

VALIDATIONS.MESSAGES = {
  MIN_PASS_LENGTH: `Password must be at least ${VALIDATIONS.MIN_PASS_LENGTH} characters long`,
  PASS_INCLUDE_NUMBER: 'Password must include at least one number',
  MIN_NAME_LENGTH: `Name must be at least ${VALIDATIONS.MIN_NAME_LENGTH} characters`,
  EMAIL_FORMAT: 'Email format: email@domain.com',
};
