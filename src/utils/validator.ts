export type ValidatorResult =
  | { valid: true }
  | { valid: false; reason: string };

const nameRegex = /^[A-ZА-ЯЁ][A-Za-zА-Яа-яёЁ-]*$/u;
// First char uppercase, only letters (latin or cyrillic), hyphen allowed, no spaces, no digits.

const loginRegex = /^(?=.{3,20}$)(?=.*[A-Za-z])[A-Za-z0-9_-]+$/;
// 3..20, latin letters required at least one, may include digits, underscores, hyphens, cannot be all digits.

const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// basic email with dot after @ and letters before dot.

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,40}$/;
// 8..40, at least one uppercase and one digit.

const phoneRegex = /^\+?\d{10,15}$/;

export function validateFirstName(value: string): ValidatorResult {
  if (!value) return { valid: false, reason: 'first_name cannot be empty' };
  if (!nameRegex.test(value)) {
    return {
      valid: false,
      reason:
        'first_name must start with uppercase and contain only letters or hyphen',
    };
  }
  return { valid: true };
}

export function validateSecondName(value: string): ValidatorResult {
  return validateFirstName(value);
}

export function validateLogin(value: string): ValidatorResult {
  if (!value) return { valid: false, reason: 'login cannot be empty' };
  if (!loginRegex.test(value)) {
    return {
      valid: false,
      reason:
        'login must be 3-20 chars, latin, may include digits, hyphen, underscore and cannot be only digits',
    };
  }
  return { valid: true };
}

export function validateEmail(value: string): ValidatorResult {
  if (!value) return { valid: false, reason: 'email cannot be empty' };
  if (!emailRegex.test(value)) return { valid: false, reason: 'invalid email format' };
  return { valid: true };
}

export function validatePassword(value: string): ValidatorResult {
  if (!value) return { valid: false, reason: 'password cannot be empty' };
  if (!passwordRegex.test(value)) {
    return {
      valid: false,
      reason:
        'password must be 8-40 chars, include at least one uppercase letter and one digit',
    };
  }
  return { valid: true };
}

export function validatePhone(value: string): ValidatorResult {
  if (!value) return { valid: false, reason: 'phone cannot be empty' };
  if (!phoneRegex.test(value)) {
    return {
      valid: false,
      reason: 'phone must be 10-15 digits, may start with +',
    };
  }
  return { valid: true };
}

export function validateMessage(value: string): ValidatorResult {
  if (!value || value.trim() === '') return { valid: false, reason: 'message cannot be empty' };
  return { valid: true };
}
