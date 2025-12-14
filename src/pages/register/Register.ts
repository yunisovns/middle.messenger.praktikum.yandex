import Block from '../../core/Block.ts';
import { validateField, validateForm, type ValidationResult } from '../../utils/validator.ts';
import { serializeForm } from '../../utils/helpers.ts';

interface RegisterProps extends Record<string, unknown> {
  events?: Record<string, EventListener>;
}

const template = `
<div class="page register-page">
  <h1>Register</h1>
  <form class="form">
    <div class="form-group">
      <input name="first_name" placeholder="First name" />
      <div class="error-text"></div>
    </div>
    <div class="form-group">
      <input name="second_name" placeholder="Second name" />
      <div class="error-text"></div>
    </div>
    <div class="form-group">
      <input name="login" placeholder="Login" />
      <div class="error-text"></div>
    </div>
    <div class="form-group">
      <input name="email" placeholder="Email" />
      <div class="error-text"></div>
    </div>
    <div class="form-group">
      <input name="password" type="password" placeholder="Password" />
      <div class="error-text"></div>
    </div>
    <div class="form-group">
      <input name="phone" placeholder="Phone" />
      <div class="error-text"></div>
    </div>
    <button type="submit">Register</button>
  </form>
  <a href="/login">Login</a>
</div>
`;

export default class Register extends Block<RegisterProps> {
  constructor() {
    super({
      events: {
        submit: (e: Event) => this.onSubmit(e),
        blur: (e: Event) => this.onBlur(e),
      },
    });
  }

  protected render(): string {
    return template;
  }

  private onBlur(e: Event): void {
    const target = e.target as HTMLInputElement;
    
    if (!target || target.tagName !== 'INPUT') {
      return;
    }

    const result = validateField(target.name, target.value);
    this.showValidation(target, result);
  }

  private onSubmit(e: Event): void {
    e.preventDefault();

    const form = (e.target as HTMLElement).closest('form');
    if (!form) return;

    const data = serializeForm(form);
    const validationResult = validateForm(data);

    let isValid = true;

    Object.entries(validationResult).forEach(([name, result]) => {
      const input = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
      if (!input) return;

      this.showValidation(input, result);

      if (!result.isValid) {
        isValid = false;
      }
    });

    if (isValid) {
      // eslint-disable-next-line no-console
      console.log('Register form data:', data);
      // Здесь можно вызвать метод для регистрации пользователя
    }
  }

  private showValidation(
    input: HTMLInputElement,
    result: ValidationResult
  ): void {
    const errorEl = input.nextElementSibling as HTMLElement | null;
    if (!errorEl || !errorEl.classList.contains('error-text')) return;

    errorEl.textContent = result.error ?? '';
    
    if (result.error) {
      input.classList.add('input--error');
    } else {
      input.classList.remove('input--error');
    }
  }
}