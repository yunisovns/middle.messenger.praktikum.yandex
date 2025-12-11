type Callback = (...args: unknown[]) => void;

export default class EventBus {
  private listeners: Record<string, Callback[]> = {};

  on(event: string, callback: Callback): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event: string, callback: Callback): void {
    this.listeners[event] = this.listeners[event]?.filter((cb) => cb !== callback) ?? [];
  }

  emit(event: string, ...args: unknown[]): void {
    (this.listeners[event] ?? []).forEach((cb) => {
      cb(...args);
    });
  }
}
