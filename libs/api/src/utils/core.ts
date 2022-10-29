import { firebase } from './../firebase/firebase';
import { DateObject } from '../mappers/types';

export const api = 'http://localhost:8080';
export const ws = 'ws://localhost:8080/echo';
export const orgin = 'http://localhost:3000';

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

export async function callReturn<T>(
  url: string,
  init?: ReturnOptions<T>
): Promise<T> {
  const options = await withDefault(init);

  return call(url, options).then((res) =>
    handleResult<T>(res, init, (res) => res.json())
  );
}

async function handleResult<T>(
  res: Response,
  options: ReturnOptions<T>,
  mapper: (res: Response) => Promise<T>
): Promise<T> {
  if (!res.ok) {
    if (options.allowed && options.allowed[res.status]) {
      return options.allowed[res.status](res);
    } else if (options.errorOnFail ?? true) {
      throw new Error(await res.text());
    }
  }

  return await mapper(res);
}

async function handle(res: Response, options: Options) {
  if (!res.ok && (options.errorOnFail ?? true)) {
    throw new Error(await res.text());
  }

  return res;
}

export async function withDefault<T extends Options>(
  options: T
): Promise<RequestInit> {
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
      Authorization:
        currentUser != null
          ? 'Bearer ' + (await currentUser.getIdToken())
          : undefined,
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

export function stringifyDate(date: Date): string {
  if (date == null) return null;
  return date.getTime().toString();
}

export function parseDate(date?: DateObject): Date | null {
  if (date != null) {
    return new Date(date);
  } else {
    return null;
  }
}

function toFormField(
  input: Date | Blob | string | boolean | number
): Blob | string {
  if (input instanceof Date) {
    return stringifyDate(input);
  }

  switch (typeof input) {
    case 'number':
      return input.toString();
    case 'boolean':
      return input ? 'true' : 'false';
    default:
      return input;
  }
}

export function toFormData(from: {
  [key: string]: Blob | string | boolean | number | null | undefined;
}): FormData {
  const data = new FormData();

  for (const [key, value] of Object.entries(from)) {
    if (value != null) {
      data.append(key, toFormField(value));
    }
  }
  return data;
}
