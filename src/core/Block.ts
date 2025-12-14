import EventBus from './EventBus.ts';

type Props = Record<string, unknown>;

export const BLOCK_EVENTS = {
  INIT: 'init',
  FLOW_CDM: 'flow:component-did-mount',
  FLOW_CDU: 'flow:component-did-update',
  FLOW_RENDER: 'flow:render',
} as const;

// Типизация событий для EventBus с общим типом Props
type BlockEvents = {
  [BLOCK_EVENTS.INIT]: [];
  [BLOCK_EVENTS.FLOW_CDM]: [];
  [BLOCK_EVENTS.FLOW_CDU]: [oldProps: Props, newProps: Props];
  [BLOCK_EVENTS.FLOW_RENDER]: [];
};

export default abstract class Block<P extends Props = Props> {
  static EVENTS = BLOCK_EVENTS;

  protected props: P;
  protected element: HTMLElement | null = null;

  private eventBus: EventBus<BlockEvents>;

  constructor(props: P) {
    this.eventBus = new EventBus<BlockEvents>();
    this.props = this.makePropsProxy(props);

    this.registerEvents();
    this.eventBus.emit(Block.EVENTS.INIT);
  }

  private registerEvents(): void {
    this.eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    this.eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    this.eventBus.on(Block.EVENTS.FLOW_CDM, this.componentDidMount.bind(this));
    this.eventBus.on(
      Block.EVENTS.FLOW_CDU,
      this._componentDidUpdate.bind(this)
    );
  }

  protected init(): void {
    this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
  }

  protected componentDidMount(): void {
    // Хук для переопределения в наследниках
  }

  protected componentDidUpdate(oldProps: P, newProps: P): boolean {
    return oldProps !== newProps;
  }

  // Изменяем параметры на Props, но приводим их к P внутри метода
  private _componentDidUpdate(oldProps: Props, newProps: Props): void {
    const shouldUpdate = this.componentDidUpdate(oldProps as P, newProps as P);

    if (shouldUpdate) {
      this.eventBus.emit(Block.EVENTS.FLOW_RENDER);
    }
  }

  setProps(nextProps: Partial<P>): void {
    if (!nextProps) return;

    Object.assign(this.props, nextProps);
  }

  private makePropsProxy(props: P): P {
    // Создание алиаса необходимо для доступа к `this` внутри замыкания Proxy
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return new Proxy(props, {
      set(target, prop: string, value) {
        const oldProps = { ...target };

        target[prop as keyof P] = value;

        // Передаём как Props (базовый тип)
        self.eventBus.emit(Block.EVENTS.FLOW_CDU, oldProps, target);

        return true;
      },
    });
  }

  private _render(): void {
    this.removeEvents();

    const fragment = this.render();

    const template = document.createElement('template');
    template.innerHTML = fragment;

    const newElement = template.content.firstElementChild as HTMLElement;

    if (this.element) {
      this.element.replaceWith(newElement);
    }

    this.element = newElement;
    this.addEvents();
    this.eventBus.emit(Block.EVENTS.FLOW_CDM);
  }

  protected abstract render(): string;

  protected getContent(): HTMLElement {
    if (!this.element) {
      throw new Error('Block is not rendered');
    }

    return this.element;
  }

  protected addEvents(): void {
    const { events } = this.props as {
      events?: Record<string, EventListener>;
    };

    if (!events || !this.element) return;

    Object.entries(events).forEach(([event, listener]) => {
      this.element!.addEventListener(event, listener);
    });
  }

  protected removeEvents(): void {
    const { events } = this.props as {
      events?: Record<string, EventListener>;
    };

    if (!events || !this.element) return;

    Object.entries(events).forEach(([event, listener]) => {
      this.element!.removeEventListener(event, listener);
    });
  }

  public mount(selector: string): void {
    const root = document.querySelector(selector);

    if (!root) {
      throw new Error(`Root element ${selector} not found`);
    }

    root.replaceChildren(this.getContent());
  }
}
