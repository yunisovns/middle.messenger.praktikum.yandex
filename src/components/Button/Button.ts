import Block from "../../core/Block";

const template =
  '<button class="btn {{className}}" type="{{type}}">{{text}}</button>';

export default class Button extends Block {
  render(): string {
    return template;
  }

  protected componentDidMount(): void {
    const el = this.element;
    if (!el) return;
    el.addEventListener("click", (e) => {
      const onClick = this.props.onClick as
        | ((e: MouseEvent) => void)
        | undefined;
      if (onClick) onClick(e as MouseEvent);
    });
  }
}
