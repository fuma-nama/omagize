import { firebase } from './../firebase/firebase';
import { OmagizeError, APIErrorCode } from '../types/common';

export const api = import.meta.env.VITE_API;
export const orgin = document.location.origin;

export type ReturnOptions<T> = Options & {
  /**
   * Map result if status code is not equal to 200
   * @param status
   */
  allowed?: {
    [status: number]: (res: Response) => T;
  };
};

export type Options = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  contentType?: 'application/json';
  body?: string | FormData;

  /**
   * throw an error if status code is not equal to 200
   *
   * default: true
   */
  errorOnFail?: boolean;
  init?: RequestInit;
};

export async function call(url: string, init?: RequestInit) {
  return fetch(`${api}${url}`, init);
}

export async function callDefault(url: string, init?: Options) {
  const options = await withDefault(init);

  return call(url, options).then((r) => handle(r, init));
}

export async function callReturn<T>(url: string, init?: ReturnOptions<T>): Promise<T> {
  const options = await withDefault(init);

  return call(url, options).then((res) => handleResult<T>(res, init, (res) => res.json()));
}

async function handleResult<T>(
  res: Response,
  options: ReturnOptions<T>,
  mapper: (res: Response) => Promise<T>
): Promise<T> {
  if (!res.ok) {
    if (options.allowed && options.allowed[res.status]) {
      return options.allowed[res.status](res);
    } else handleError(res, options);
  }

  return await mapper(res);
}

async function handle(res: Response, options: Options) {
  await handleError(res, options);

  return res;
}
/** throw error if condition matches */
async function handleError(res: Response, options: Options) {
  if (!res.ok && (options.errorOnFail ?? true)) {
    const raw = await res.json().catch(() => ({
      code: APIErrorCode.Client,
      message: 'client-side error',
    }));

    throw new OmagizeError(raw);
  }
}

export async function withDefault<T extends Options>(options: T): Promise<RequestInit> {
  const currentUser = firebase.auth.currentUser;
  const brand = options.init;
  const isForm = options.body instanceof FormData;

  return {
    method: options.method,
    credentials: 'include',
    body: options.body,
    ...brand,
    headers: {
      ...(!isForm && {
        'Content-Type': options.contentType ?? 'application/json',
      }),
      Authorization: currentUser != null ? 'Bearer ' + (await currentUser.getIdToken()) : undefined,
      ...brand?.headers,
    },
  };
}

export function withDefaultForm<T extends Options>(options: T): T {
  return {
    credentials: 'include',
    ...options,
  };
}
