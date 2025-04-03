import { renderHook } from '@testing-library/react';
import useValidation from '../useValidation';
import { VALIDATIONS } from '../../constants';

describe('useValidation custom hook', () => {
  test('validates name correctly', () => {
    const { result } = renderHook(() => useValidation());

    expect(result.current.validateInput.name('')).toBe('');
    expect(result.current.validateInput.name('A')).toBe(
      `Name must be at least ${VALIDATIONS.MIN_NAME_LENGTH} characters`
    );
    expect(result.current.validateInput.name('Alex')).toBe('');
  });

  test('validates email correctly', () => {
    const { result } = renderHook(() => useValidation());

    expect(result.current.validateInput.email('')).toBe('');
    expect(result.current.validateInput.email('invalid-email')).toBe(
      'Email format: email@domain.com'
    );
    expect(result.current.validateInput.email('test@example.com')).toBe('');
  });

  test('validates password correctly', () => {
    const { result } = renderHook(() => useValidation());

    expect(result.current.validateInput.password('')).toBe('');
    expect(result.current.validateInput.password('abc')).toBe(
      `Password must be at least ${VALIDATIONS.MIN_PASS_LENGTH} characters long`
    );
    expect(result.current.validateInput.password('longpassword')).toBe(
      'Password must include at least one number'
    );
    expect(result.current.validateInput.password('valid1Password')).toBe('');
  });
});
