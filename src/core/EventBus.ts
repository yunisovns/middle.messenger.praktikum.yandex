type EventMap = {
  [key: string]: unknown[];
};

class EventBus<T extends EventMap = EventMap> {
  private listeners: {
    [K in keyof T]?: Array<(...args: T[K]) => void>
  } = {};

  on<K extends keyof T>(event: K, callback: (...args: T[K]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(callback);
  }

  off<K extends keyof T>(event: K, callback: (...args: T[K]) => void): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event] = this.listeners[event]!.filter(
      (listener) => listener !== callback,
    );
  }

  emit<K extends keyof T>(event: K, ...args: T[K]): void {
    if (!this.listeners[event]) {
      return;
    }
    this.listeners[event]!.forEach((listener) => {
      listener(...args);
    });
  }
}

export default EventBus;