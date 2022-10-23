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

export function stringOfTime(date: Date): string {
  const now = new Date(Date.now());
  const isNow =
    now.getDate() === date.getDate() && now.getMinutes() == date.getMinutes();

  if (isNow) {
    return 'Now';
  } else {
    const dateText = stringOfDate(date);
    return (
      `${dateText} ` +
      date.toLocaleTimeString(['en-us'], {
        timeStyle: 'short',
      })
    );
  }
}

export function stringOfDate(date: Date) {
  const now = new Date(Date.now());
  const today = now.getDate() === date.getDate();

  if (today) {
    return 'Today';
  } else if (now.getDate() === date.getDate() + 1) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString(['en-us'], {
      dateStyle: 'short',
    });
  }
}
