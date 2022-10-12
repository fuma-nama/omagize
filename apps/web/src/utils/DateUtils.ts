import { TimeValue } from '../components/picker/TimePicker';

export function applyDate(original: Date | null, value: TimeValue): Date {
  const next = new Date(original ?? Date.now());
  next.setHours(value.hours, value.minutes);
  return next;
}

/**
 * exclude time data
 */
export function onlyDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/**
 * only keep hours and minutes
 */
export function onlyTime(date: Date): Date {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  );
}
