type Route = {
  path: string;
  render: () => string;
};

export class Router {
  private routes: Route[] = [];
  private root: HTMLElement;

  constructor(rootId: string) {
    const el = document.getElementById(rootId);
    if (!el) {
      throw new Error(`Root element #${rootId} not found`);
    }
    this.root = el;
    this.handlePopState = this.handlePopState.bind(this);
    window.addEventListener("popstate", this.handlePopState);
  }

  use(path: string, render: () => string): Router {
    this.routes.push({ path, render });
    return this;
  }

  start() {
    this.go(window.location.pathname, false);
  }

  go(path: string, push: boolean = true) {
    const route = this.routes.find((r) => r.path === path);
    if (!route) {
      this.root.innerHTML = "<h1>404 — Page not found</h1>";
      return;
    }
    this.root.innerHTML = route.render();
    if (push) {
      window.history.pushState({}, "", path);
    }
  }

  private handlePopState() {
    this.go(window.location.pathname, false);
  }
}
