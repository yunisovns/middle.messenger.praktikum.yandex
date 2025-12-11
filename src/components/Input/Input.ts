import Block from '../../core/Block';

const template = `
<div class="input-wrapper">
  <input 
  id="{{id}}" 
  name="{{name}}" 
  type="{{type}}" 
  placeholder="{{placeholder}}" 
  class="input {{className}}" 
  value="{{value}}" 
  />
  {{#if error}}
  <div class="error-text">{{error}}</div>
  {{/if}}
</div>
`;

export default class Input extends Block {
  render(): string {
    return template;
  }

  protected componentDidMount(): void {
    const el = this.element?.querySelector('input');
    if (!el) return;
    const inputEl = el as HTMLInputElement;
    inputEl.addEventListener('input', (e) => {
      this.setProps({ value: inputEl.value });
      const onInput = this.props.onInput as ((e: Event) => void) | undefined;
      if (onInput) onInput(e);
    });
    inputEl.addEventListener('blur', (e) => {
      const onBlur = this.props.onBlur as ((e: FocusEvent) => void) | undefined;
      if (onBlur) onBlur(e as FocusEvent);
    });
  }
}
