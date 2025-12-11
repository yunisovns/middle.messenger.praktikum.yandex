import Block from '../../core/Block';
import { validateLogin, validatePassword } from '../../utils/validator';
import { serializeForm } from '../../utils/helpers';

const template = `
<div class="page login-page">
  <h1>Login</h1>
  <form id="login-form" class="form">
    <div id="login-inputs"></div>
    <button type="submit" class="btn">Login</button>
  </form>
  <a href="/register">Register</a>
</div>
`;

export default class Login extends Block {
  constructor() {
    super({});
  }

  render(): string {
    return template;
  }

  protected componentDidMount(): void {
    const root = this.element;
    if (!root) return;

    const form = root.querySelector('#login-form') as HTMLFormElement;
    const loginInputWrapper = root.querySelector('#login-inputs');
    if (!loginInputWrapper || !form) return;

    // Create inputs using the Input component minimal approach
    // We'll render plain inputs for simplicity and hook blur/submit validation

    const loginEl = document.createElement('input');
    loginEl.name = 'login';
    loginEl.placeholder = 'login';
    loginEl.className = 'input';
    loginEl.addEventListener('blur', () => {
      const res = validateLogin(loginEl.value);
      loginEl.dataset.error = res.valid ? '' : res.reason;
      this.updateError(loginEl);
    });
    loginInputWrapper.appendChild(loginEl);

    const passEl = document.createElement('input');
    passEl.name = 'password';
    passEl.type = 'password';
    passEl.placeholder = 'password';
    passEl.className = 'input';
    passEl.addEventListener('blur', () => {
      const res = validatePassword(passEl.value);
      passEl.dataset.error = res.valid ? '' : res.reason;
      this.updateError(passEl);
    });
    loginInputWrapper.appendChild(passEl);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = serializeForm(form);
      const v1 = validateLogin(data.login ?? '');
      const v2 = validatePassword(data.password ?? '');
      if (!v1.valid) {
        loginEl.dataset.error = v1.reason;
        this.updateError(loginEl);
      }
      if (!v2.valid) {
        passEl.dataset.error = v2.reason;
        this.updateError(passEl);
      }
      if (v1.valid && v2.valid) {
        // eslint-disable-next-line no-console
        console.log('Login form data:', data);
        // Here you would call AuthService.login(...)
      }
    });
  }

  private updateError(input: HTMLInputElement): void {
    let el = input.nextElementSibling as HTMLElement | null;
    if (el && el.classList.contains('error-text')) {
      el.textContent = input.dataset.error ?? '';
    } else {
      el = document.createElement('div');
      el.className = 'error-text';
      el.textContent = input.dataset.error ?? '';
      input.after(el);
    }
    if (input.dataset.error) input.classList.add('input--error');
    else input.classList.remove('input--error');
  }
}
