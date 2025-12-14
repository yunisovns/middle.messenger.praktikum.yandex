type Callback<T extends unknown[] = unknown[]> = (...args: T) => void;

export default class EventBus<TEvents extends Record<string, unknown[]>> {
  private listeners: { [K in keyof TEvents]?: Callback<TEvents[K]>[] } = {};

  on<K extends keyof TEvents>(event: K, callback: Callback<TEvents[K]>): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]?.push(callback);
  }

  off<K extends keyof TEvents>(event: K, callback: Callback<TEvents[K]>): void {
    this.listeners[event] = this.listeners[event]?.filter(
      (listener) => listener !== callback
    );
  }

  emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): void {
    this.listeners[event]?.forEach((listener) => listener(...args));
  }
}
