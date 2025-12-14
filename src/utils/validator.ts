export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

type ValidatorFn = (value: string) => ValidationResult;

const nameRegex = /^[A-ZА-ЯЁ][A-Za-zА-Яа-яёЁ-]*$/u;
const loginRegex = /^(?=.{3,20}$)(?=.*[A-Za-z])[A-Za-z0-9_-]+$/;
const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,40}$/;
const phoneRegex = /^\+?\d{10,15}$/;

const validators: Record<string, ValidatorFn> = {
  first_name: (value: string) =>
    nameRegex.test(value)
      ? { isValid: true }
      : {
          isValid: false,
          error:
            'Имя: первая буква заглавная, только буквы, допустим дефис',
        },

  second_name: (value: string) =>
    nameRegex.test(value)
      ? { isValid: true }
      : {
          isValid: false,
          error:
            'Фамилия: первая буква заглавная, только буквы, допустим дефис',
        },

  login: (value: string) =>
    loginRegex.test(value)
      ? { isValid: true }
      : {
          isValid: false,
          error:
            'Логин: 3–20 символов, латиница, цифры допустимы, но не только цифры',
        },

  email: (value: string) =>
    emailRegex.test(value)
      ? { isValid: true }
      : {
          isValid: false,
          error: 'Некорректный email',
        },

  password: (value: string) =>
    passwordRegex.test(value)
      ? { isValid: true }
      : {
          isValid: false,
          error:
            'Пароль: 8–40 символов, минимум одна заглавная буква и цифра',
        },

  phone: (value: string) =>
    phoneRegex.test(value)
      ? { isValid: true }
      : {
          isValid: false,
          error:
            'Телефон: 10–15 цифр, может начинаться с +',
        },

  message: (value: string) =>
    value.trim()
      ? { isValid: true }
      : {
          isValid: false,
          error: 'Сообщение не может быть пустым',
        },
};

export function validateField(
  name: string,
  value: string
): ValidationResult {
  const validator = validators[name];

  if (!validator) {
    return { isValid: true };
  }

  return validator(value);
}

export function validateForm(
  data: Record<string, string>
): Record<string, ValidationResult> {
  const result: Record<string, ValidationResult> = {};

  Object.entries(data).forEach(([name, value]) => {
    result[name] = validateField(name, value);
  });

  return result;
}
