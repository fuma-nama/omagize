import { DateObject } from '../types/common';

export function toFormData(from: {
  [key: string]: Date | Blob | string | boolean | number | null | undefined;
}): FormData {
  const data = new FormData();

  for (const [key, value] of Object.entries(from)) {
    if (value != null) {
      data.append(key, toFormField(value));
    }
  }
  return data;
}

export function toFormField(input: Date | Blob | string | boolean | number): Blob | string {
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

export function boolToString(value: boolean): string {
  return value === true ? 'true' : 'false';
}
