import { queryStringify } from '../utils/queryStringify.ts';

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const;

type Method = (typeof METHODS)[keyof typeof METHODS];

type RequestOptions = {
  method?: Method;
  data?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
};

export default class HTTPTransport {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  get(url: string, options: RequestOptions = {}): Promise<unknown> {
    const query = options.data ? queryStringify(options.data) : '';
    return this.request(`${url}${query}`, { ...options, method: METHODS.GET });
  }

  post(url: string, options: RequestOptions = {}): Promise<unknown> {
    return this.request(url, { ...options, method: METHODS.POST });
  }

  put(url: string, options: RequestOptions = {}): Promise<unknown> {
    return this.request(url, { ...options, method: METHODS.PUT });
  }

  delete(url: string, options: RequestOptions = {}): Promise<unknown> {
    return this.request(url, { ...options, method: METHODS.DELETE });
  }

  private request(url: string, options: RequestOptions): Promise<unknown> {
    const {
      method = METHODS.GET,
      data,
      headers = {},
      timeout = 5000,
    } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open(method, `${this.baseUrl}${url}`);
      xhr.timeout = timeout;

      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(xhr.response);
        } else {
          reject(new Error(xhr.statusText));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Request timeout'));

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(data));
      }
    });
  }
}
