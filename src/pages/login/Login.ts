import Block from '../../core/Block.ts';
import { validateField, validateForm } from '../../utils/validator.ts';
import { serializeForm } from '../../utils/helpers.ts';

interface LoginProps extends Record<string, unknown> {
  events?: {
    submit?: (e: Event) => void;
    blur?: (e: FocusEvent) => void;
  };
}

const template = `
<div class="page login-page">
  <h1>Login</h1>
  <form class="form">
    <div class="form-group">
      <input name="login" type="text" placeholder="Login" />
      <div class="error-text"></div>
    </div>
    <div class="form-group">
      <input name="password" type="password" placeholder="Password" />
      <div class="error-text"></div>
    </div>
    <button type="submit" class="btn">Login</button>
  </form>
  <a href="/register">Register</a>
</div>
`;

export default class Login extends Block<LoginProps> {
  constructor() {
    super({
      events: {
        submit: (e: Event) => this.onSubmit(e),
        blur: (e: FocusEvent) => this.onBlur(e),
      },
    });
  }

  protected render(): string {
    return template;
  }

  private onBlur(e: FocusEvent): void {
    const target = e.target;

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const { name, value } = target;
    const result = validateField(name, value);

    this.showValidation(target, result);
  }

  private onSubmit(e: Event): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const data = serializeForm(form);
    const validationResult = validateForm(data);

    let isFormValid = true;

    Object.entries(validationResult).forEach(([name, result]) => {
      const input = form.querySelector<HTMLInputElement>(
        `input[name="${name}"]`
      );

      if (!input) return;

      this.showValidation(input, result);

      if (!result.isValid) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // eslint-disable-next-line no-console
      console.log(data);
    }
  }

  private showValidation(
    input: HTMLInputElement,
    result: { isValid: boolean; error?: string }
  ): void {
    const errorEl = input.nextElementSibling as HTMLElement | null;

    if (!errorEl) return;

    errorEl.textContent = result.error ?? '';
    input.classList.toggle('input--error', !result.isValid);
  }
}
