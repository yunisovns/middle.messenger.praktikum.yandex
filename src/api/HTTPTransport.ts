export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

function queryStringify(data: Record<string, unknown>): string {
  const keys = Object.keys(data);
  if (!keys.length) {
    return '';
  }
  return `?${keys
    .map(
      (k) => `${encodeURIComponent(k)}=${encodeURIComponent(
        String((data as any)[k]),
      )}`,
    )
    .join('&')}`;
}

export default class HTTPTransport {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  public get(
    url: string,
    data: Record<string, unknown> = {},
  ): Promise<XMLHttpRequest> {
    const query = queryStringify(data);
    return this.request(`${this.baseUrl}${url}${query}`, {
      method: METHODS.GET,
    });
  }

  public post(url: string, data: unknown): Promise<XMLHttpRequest> {
    return this.request(`${this.baseUrl}${url}`, {
      method: METHODS.POST,
      data,
    });
  }

  public put(url: string, data: unknown): Promise<XMLHttpRequest> {
    return this.request(`${this.baseUrl}${url}`, { method: METHODS.PUT, data });
  }

  public delete(url: string, data: unknown): Promise<XMLHttpRequest> {
    return this.request(`${this.baseUrl}${url}`, {
      method: METHODS.DELETE,
      data,
    });
  }

  private request(
    url: string,
    options: { method: METHODS; data?: unknown; timeout?: number } = {
      method: METHODS.GET,
    },
  ): Promise<XMLHttpRequest> {
    const { method, data, timeout = 5000 } = options;
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.withCredentials = true;
      xhr.timeout = timeout;

      if (!(data instanceof FormData)) {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr);
        } else {
          reject(xhr);
        }
      };

      xhr.onabort = () => reject(xhr);
      xhr.onerror = () => reject(xhr);
      xhr.ontimeout = () => reject(xhr);

      try {
        if (method === METHODS.GET || data === undefined) {
          xhr.send();
        } else if (data instanceof FormData) {
          xhr.send(data);
        } else {
          xhr.send(JSON.stringify(data));
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}
