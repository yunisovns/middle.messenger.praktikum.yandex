import Block from '../../core/Block.ts';
import { serializeForm } from '../../utils/helpers.ts';
import { validateField, type ValidationResult } from '../../utils/validator.ts';

const template = `
<div class="page settings-page">
  <h1>Settings</h1>
  <form id="settings-form" class="form">
    <div id="settings-inputs"></div>
    <button type="submit" class="btn">Save</button>
  </form>
</div>
`;

export default class Settings extends Block {
  constructor() {
    super({});
  }

  render(): string {
    return template;
  }

  protected componentDidMount(): void {
    const root = this.element;
    if (!root) return;
    const form = root.querySelector('#settings-form') as HTMLFormElement;
    const wrapper = root.querySelector('#settings-inputs');
    if (!form || !wrapper) return;

    // Массив полей с их именами (используем имена как в validator.ts)
    const fields: { name: string; placeholder: string; type?: string }[] = [
      { name: 'first_name', placeholder: 'First name' },
      { name: 'second_name', placeholder: 'Second name' },
      { name: 'email', placeholder: 'Email' },
      { name: 'phone', placeholder: 'Phone' },
      // Можно добавить другие поля, например 'display_name', 'login' если нужно
    ];

    fields.forEach((f) => {
      const input = document.createElement('input');
      input.name = f.name;
      input.placeholder = f.placeholder;
      input.type = f.type ?? 'text';
      input.className = 'input';
      
      // Валидация по blur с использованием единого validateField
      input.addEventListener('blur', () => {
        const result: ValidationResult = validateField(f.name, input.value); // <-- Используем validateField
        input.dataset.error = result.isValid ? '' : (result.error || '');
        this.updateError(input);
      });
      
      wrapper.appendChild(input);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = serializeForm(form);
      let isFormValid = true;

      // Валидация всех полей при submit
      fields.forEach((f) => {
        const value = data[f.name] ?? '';
        const result: ValidationResult = validateField(f.name, value); // <-- Используем validateField
        const el = form.querySelector(`[name="${f.name}"]`) as HTMLInputElement | null;
        
        if (el) {
          el.dataset.error = result.isValid ? '' : (result.error || '');
          this.updateError(el);
        }
        if (!result.isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // eslint-disable-next-line no-console
        console.log('Settings form data:', data);
        // Здесь можно вызвать метод для обновления профиля, например:
        // AuthService.updateProfile(data);
      }
    });
  }

  private updateError(input: HTMLInputElement): void {
    let errorEl = input.nextElementSibling as HTMLElement | null;
    if (errorEl && errorEl.classList.contains('error-text')) {
      errorEl.textContent = input.dataset.error ?? '';
    } else {
      errorEl = document.createElement('div');
      errorEl.className = 'error-text';
      errorEl.textContent = input.dataset.error ?? '';
      input.after(errorEl);
    }
    if (input.dataset.error) {
      input.classList.add('input--error');
    } else {
      input.classList.remove('input--error');
    }
  }
}