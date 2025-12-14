import Block from '../../core/Block.ts';
import { serializeForm } from '../../utils/helpers.ts';

const template = `
<form class="form" id="{{id}}">
  {{{children}}}
</form>
`;

export default class Form extends Block {
  render(): string {
    return template;
  }

  protected componentDidMount(): void {
    const el = this.element?.querySelector('form') as HTMLFormElement | null;
    if (!el) return;
    el.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = serializeForm(el);
      const onSubmit = this.props.onSubmit as
        | ((data: Record<string, string>, e: Event) => void)
        | undefined;
      if (onSubmit) onSubmit(data, e);
    });
  }
}
