import Block from '../../core/Block';
import { serializeForm } from '../../utils/helpers';
import {
  validateFirstName, validateSecondName, validateLogin, validateEmail, validatePassword, validatePhone,
} from '../../utils/validator';

const template = `
<div class="page register-page">
  <h1>Register</h1>
  <form id="register-form" class="form">
    <div id="register-inputs"></div>
    <button type="submit" class="btn">Register</button>
  </form>
  <a href="/login">Login</a>
</div>
`;

export default class Register extends Block {
  constructor() {
    super({});
  }

  render(): string {
    return template;
  }

  protected componentDidMount(): void {
    const root = this.element;
    if (!root) return;
    const form = root.querySelector('#register-form') as HTMLFormElement;
    const wrapper = root.querySelector('#register-inputs');
    if (!form || !wrapper) return;

    const fields: { name: string; placeholder: string; validator: (s: string) => any; type?: string }[] = [
      { name: 'first_name', placeholder: 'First name', validator: validateFirstName },
      { name: 'second_name', placeholder: 'Second name', validator: validateSecondName },
      { name: 'login', placeholder: 'Login', validator: validateLogin },
      { name: 'email', placeholder: 'Email', validator: validateEmail },
      {
        name: 'password', placeholder: 'Password', validator: validatePassword, type: 'password',
      },
      { name: 'phone', placeholder: 'Phone', validator: validatePhone },
    ];

    fields.forEach((f) => {
      const input = document.createElement('input');
      input.name = f.name;
      input.placeholder = f.placeholder;
      input.type = f.type ?? 'text';
      input.className = 'input';
      input.addEventListener('blur', () => {
        const res = f.validator(input.value);
        input.dataset.error = res.valid ? '' : res.reason;
        this.updateError(input);
      });
      wrapper.appendChild(input);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = serializeForm(form);
      let ok = true;
      fields.forEach((f) => {
        const value = data[f.name] ?? '';
        const res = f.validator(value);
        const el = form.querySelector(`[name="${f.name}"]`) as HTMLInputElement | null;
        if (el) {
          el.dataset.error = res.valid ? '' : res.reason;
          this.updateError(el);
        }
        if (!res.valid) ok = false;
      });
      if (ok) {
        console.log('Register form data:', data);
        // call AuthService.register(...)
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
