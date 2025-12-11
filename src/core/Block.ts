import Handlebars from 'handlebars';
import EventBus from './EventBus';

// Добавляем дженерик с типом по умолчанию
export default abstract class Block<P extends Record<string, unknown> = Record<string, unknown>> {
  private elementRef: HTMLElement | null = null;

  protected props: P; // Используем дженерик тип

  private eventBus: EventBus;

  constructor(props: P = {} as P) { // Указываем тип P
    this.props = props;
    this.eventBus = new EventBus();
    this.init();
  }

  protected init(): void {
    this.eventBus.emit('init');
  }

  protected compile(template: string, context: P): DocumentFragment {
    const tpl = Handlebars.compile(template);
    const html = tpl(context);
    const temp = document.createElement('template');
    temp.innerHTML = html.trim();
    return temp.content;
  }

  setProps(nextProps: Partial<P>): void { // Используем Partial<P>
    this.props = { ...this.props, ...nextProps };
    this.eventBus.emit('propsChanged', this.props);
    this.renderToDom();
  }

  get element(): HTMLElement | null {
    return this.elementRef;
  }

  protected abstract render(): string;

  private renderToDom(): void {
    const template = this.render();
    const fragment = this.compile(template, this.props);
    this.elementRef = fragment.firstElementChild as HTMLElement;
  }

  public mount(selector: string): void {
    this.renderToDom();
    const root = document.querySelector(selector);
    if (!root) {
      throw new Error(`Container ${selector} not found`);
    }
    root.innerHTML = '';
    if (this.elementRef) root.appendChild(this.elementRef);
    this.componentDidMount();
  }

  protected componentDidMount(): void {
    // override
  }
}
