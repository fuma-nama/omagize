import { useEffect, useState } from 'react';

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function fileSizeString(bytes: number, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
}

export function escapeHtml(string: string) {
  const { replace } = '';
  // escape
  const ca = /[&<>]/g;

  const esca: any = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };

  return replace.call(string, ca, (m: string) => esca[m]);
}

export function unescapeHtml(string: string) {
  const { replace } = '';
  // escape
  const es = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;

  // unescape
  const unes: any = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
  };

  return replace.call(string, es, (m: string) => unes[m]);
}

/**
 *
 * @param delay ms
 * @param focus If true, instantly set the debounced value ignoring the delay
 * @returns
 */
export function useDebounce<T>(value: T, delay: number) {
  // State and setters for debounced value
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay] // Only re-call effect if value or delay changes
  );

  return debouncedValue;
}
